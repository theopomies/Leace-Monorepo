import { useState } from "react";
import Loader from "../../components/loader";
import Profile from "../../components/profile";
import Search from "../../components/search";
import { trpc } from "../../utils/trpc";

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
          <div className="justfy-center flex w-1/5 items-center "></div>
          <div className="flex max-h-[calc(100vh-84px)] w-3/5 items-center justify-center">
            <Profile user={user.data} />
          </div>
          <div className="justfy-center flex w-1/5 items-center"></div>
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
