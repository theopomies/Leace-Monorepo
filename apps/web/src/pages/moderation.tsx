import { trpc } from "../utils/trpc";
import { LoggedLayout } from "../components/shared/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import { Loader } from "../components/moderation/Loader";
import { Moderation } from "../components/moderation/Moderation";

export default function ModerationPage() {
  return (
    <LoggedLayout title="Moderation | Leace">
      <AdminCheck>
        <Moderation />
      </AdminCheck>
    </LoggedLayout>
  );
}

const AdminCheck = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  if (!session || session.role != Role.ADMIN) {
    router.push("/");
    return <Loader />;
  }

  return <>{children}</>;
};
