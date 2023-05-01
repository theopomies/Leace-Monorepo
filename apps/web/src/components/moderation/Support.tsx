import { trpc } from "../../utils/trpc";
import { Chat } from "../shared/chat";
import { Loader } from "../shared/Loader";

export const Support = () => {
  const session = trpc.auth.getSession.useQuery();

  if (session.data && !session.error) {
    return (
      <div className="flex h-screen w-full justify-center p-4">
        <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
          <Chat userId={session.data.userId} chatOn isSupport />
        </div>
      </div>
    );
  }
  return <Loader />;
};
