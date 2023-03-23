import { UserStatus } from "@prisma/client";
import { useState } from "react";
import { Loader } from "./Loader";
import { Profile } from "./Profile";
import { Search } from "./Search";
import { trpc } from "../../utils/trpc";
import { ChatModal } from "./ChatModal";
import { useRouter } from "next/router";
import { BanButtonAdmin } from "./BanButton/BanButtonAdmin";

export const Administration = () => {
  const router = useRouter();
  const [uid, setUid] = useState((router.query.id as string) || "");

  const user = trpc.moderation.getById.useQuery(uid.toString(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (!uid)
    return (
      <div className="flex w-full justify-center">
        <div className="w-3/5">
          <Search setUid={setUid} />
        </div>
      </div>
    );
  if (user.isLoading) return <Loader />;
  if (user && user.data && !user.error) {
    return (
      <div className="flex w-full">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="w-3/5">
          <Search setUid={setUid} />
          <Profile user={user.data} />
        </div>
        <div className="flex w-1/5 flex-col items-center justify-center gap-5">
          <BanButtonAdmin
            userId={user.data.id}
            isBanned={user.data.status === UserStatus.BANNED}
          />
          <ChatModal userId={user.data.id} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center">
      <div className="w-3/5">
        <Search setUid={setUid} />
        <p className="flex w-full items-center justify-center">
          Utilisateur introuvable
        </p>
      </div>
    </div>
  );
};
