import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { SupportChat } from "../shared/chat/SupportChat";

export function SupportPage() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!session || !session.role) {
    return <div>Not logged in</div>;
  }

  return <SupportChat userId={session.userId} role={session.role} />;
}
