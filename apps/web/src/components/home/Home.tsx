import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { ModerationReportPage } from "../moderation/moderation/ModerationReportPage";
import { Loader } from "../shared/Loader";
import { RoleSelector } from "../users/RoleSelector";
import { PostStack } from "./stack/PostStack";
import { TenantList } from "./stack/TenantList";

export const Home = () => {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  if (!session || isLoading) return <Loader />;

  const role = session.role;

  if (role == undefined) return <RoleSelector userId={session.userId} />;

  if (role == Role.ADMIN) {
    router.push("/administration");
    return <Loader />;
  }

  if (role == Role.MODERATOR) return <ModerationReportPage />;

  if (role == Role.TENANT) return <PostStack />;

  return <TenantList />;
};
