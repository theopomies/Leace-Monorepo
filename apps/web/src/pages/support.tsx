import { Roles } from "@prisma/client";
import { useRouter } from "next/router";
import { LoggedLayout } from "../components/LoggedLayout";
import { trpc } from "../utils/trpc";
import { Support } from "../components/moderation/Support";
import { Loader } from "../components/moderation/Loader";

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

  if (!session || session.role != Roles.ADMIN) {
    router.push("/");
    return <Loader />;
  }

  return <>{children}</>;
};
