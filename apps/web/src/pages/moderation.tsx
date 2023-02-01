import { trpc } from "../utils/trpc";
import { LoggedLayout } from "../components/LoggedLayout";
import { Roles } from "@prisma/client";
import { useRouter } from "next/router";
import { Loader } from "../components/Moderation/Loader";

export default function Moderation() {
  return (
    <LoggedLayout title="Moderation | Leace">
      <AdminCheck />
    </LoggedLayout>
  );
}

const AdminCheck = () => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  if (!session || session.user.role != Roles.ADMIN) {
    router.push("/");
    return <Loader />;
  }

  return <Moderation />;
};
