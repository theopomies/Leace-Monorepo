import { trpc } from "../utils/trpc";
import { LoggedLayout } from "../components/LoggedLayout";
import { Roles } from "@prisma/client";
import { useRouter } from "next/router";
import { Loader } from "../components/Moderation/Loader";
import { Moderation } from "../components/Moderation/Moderation";

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

  if (!session || session.role != Roles.ADMIN) {
    router.push("/");
    return <Loader />;
  }

  return <>{children}</>;
};
