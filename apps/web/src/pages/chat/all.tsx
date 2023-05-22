import { Chat } from "../../components/shared/chat";
import { trpc } from "../../utils/trpc";
import { Loader } from "../../components/shared/Loader";
import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";

const ChatAll = () => {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) return <Loader />;

  return (
    <LoggedLayout title="Chat | Leace">
      {!!session && (
        <div className="flex h-screen w-full justify-center p-4">
          {session.role === Role.TENANT && (
            <Chat userId={session.userId} chatOn isTenant={true} />
          )}
          {(session.role === Role.AGENCY || session.role === Role.OWNER) && (
            <Chat userId={session.userId} chatOn isTenant={false} />
          )}
        </div>
      )}
    </LoggedLayout>
  );
};

export default ChatAll;
