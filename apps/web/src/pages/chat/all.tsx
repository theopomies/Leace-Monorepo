import { Chat } from "../../components/shared/chat";
import { trpc } from "../../utils/trpc";
import { Loader } from "../../components/shared/Loader";
import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";

const ChatAll = () => {
  const session = trpc.auth.getSession.useQuery();
  const role = session.data?.role;

  if (session.data && !session.error) {
    return (
      <LoggedLayout title="Chat | Leace">
        <div className="flex h-screen w-full justify-center p-4">
          {role === Role.TENANT && (
            <Chat userId={session.data.userId} chatOn isTenant={true} />
          )}
          {(role === Role.AGENCY || role === Role.OWNER) && (
            <Chat userId={session.data.userId} chatOn isTenant={false} />
          )}
        </div>
      </LoggedLayout>
    );
  }
  return <Loader />;
};

export default ChatAll;
