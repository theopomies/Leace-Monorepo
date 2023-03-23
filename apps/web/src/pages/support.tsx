import { Roles } from "@prisma/client";
import { useRouter } from "next/router";
import { LoggedLayout } from "../components/LoggedLayout";
import { Loader } from "../components/Moderation/Loader";
import { Support } from "../components/Moderation/Support";
import { trpc } from "../utils/trpc";

export default function SupportPage() {
  return (
    <LoggedLayout title="Support | Leace">
      <AdminCheck>
        <Support />
      </AdminCheck>
    </LoggedLayout>
  );
}

const AdminCheck = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  if (!session || session.user.role != Roles.ADMIN) {
    router.push("/");
    return <Loader />;
  }

  return <>{children}</>;
};
