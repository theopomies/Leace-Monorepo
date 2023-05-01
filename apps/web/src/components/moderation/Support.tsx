import { trpc } from "../../utils/trpc";
import { Chat } from "../shared/chat";
import { Loader } from "../shared/Loader";

export const Support = () => {
  const session = trpc.auth.getSession.useQuery();

  if (session.data && !session.error) {
    return (
      <div className="flex h-screen w-full justify-center p-4">
        <Chat userId={session.data.userId} chatOn isSupport />
      </div>
    );
  }
  return <Loader />;
};
