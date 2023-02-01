import { UserStatus } from "@prisma/client";
import { useState } from "react";
import { BanButton, UnBanButton } from "../../components/Moderation/BanButton";
import Loader from "../../components/Moderation/Loader";
import Profile from "../../components/Moderation/Profile";
import Search from "../../components/Moderation/Search";
import { trpc } from "../../utils/trpc";
import ChatModal from "../../components/Moderation/ChatModal";

const Admin = () => {
  const [uid, setUid] = useState("");

  const user = trpc.moderation.getById.useQuery(uid.toString(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (!uid) return <Search setUid={setUid} />;
  if (user?.isLoading) return <Loader />;
  if (user && user.data && !user.error) {
    return (
      <div>
        <Search setUid={setUid} />
        <div className="my-5 flex">
          <div className="flex w-1/5 items-center justify-center"></div>
          <div className="flex max-h-[calc(100vh-84px)] w-3/5 items-center justify-center">
            <Profile user={user.data} />
          </div>
          <div className="flex h-[calc(100vh-84px)] w-1/5 flex-col items-center justify-center gap-5">
            {user.data.status == UserStatus.BANNED ? (
              <UnBanButton userId={user.data.id} />
            ) : (
              <BanButton userId={user.data.id} />
            )}
            <ChatModal userId={user.data.id} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Search setUid={setUid} />
      <div className="flex w-full items-center justify-center">
        <p>Utilisateur introuvable</p>
      </div>
    </div>
  );
};

export default Admin;
