import { Chat } from "../../components/Chat";
import { trpc } from "../../utils/trpc";
import { Loader } from "./Loader";

export const Support = () => {
  const session = trpc.auth.getSession.useQuery();

  if (session.data && !session.error) {
    return (
      <div className="flex h-screen w-full justify-center p-4">
        <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
          <Chat userId={session.data.user.id} chatOn isModeration />
        </div>
      </div>
    );
  }
  return <Loader />;
};
