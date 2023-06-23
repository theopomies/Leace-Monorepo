import { Role } from "@prisma/client";
import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Loader } from "../../components/shared/Loader";
import { SupportChat } from "../../components/shared/chat/SupportChat";

export default function SupportPage() {
  const router = useRouter();
  const { conversationId } = router.query;
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!conversationId || typeof conversationId !== "string" || !session) {
    return <div>BAD REQ</div>;
  }

  return (
    <LoggedLayout title="Support | Leace" roles={[Role.ADMIN]}>
      <div className="flex h-screen w-full justify-center p-4">
        <SupportChat
          userId={session.userId}
          conversationId={conversationId}
          role="ADMIN"
        />
      </div>
    </LoggedLayout>
  );
}
