import { Chat } from "../../components/shared/chat";
import { trpc } from "../../utils/trpc";
import { Loader } from "../../components/shared/Loader";
import { LoggedLayout } from "../../components/layout/LoggedLayout";

const Support = () => {
  const session = trpc.auth.getSession.useQuery();

  if (session.data && !session.error) {
    return (
      <LoggedLayout title="Chat | Leace">
        <div className="flex h-screen w-full justify-center p-4">
          <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
            <Chat userId={session.data.userId} chatOn />
          </div>
        </div>
      </LoggedLayout>
    );
  }
  return <Loader />;
};

export default Support;
