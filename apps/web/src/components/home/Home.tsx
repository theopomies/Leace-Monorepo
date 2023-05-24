import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { RoleSelector } from "../users/RoleSelector";
import { PostStack } from "./stack/PostStack";
import { TenantStack } from "./stack/TenantStack";
import { Administration } from "../moderation/Administration";
import { Moderation } from "../moderation/Moderation";
import { Loader } from "../shared/Loader";
import { useRouter } from "next/router";

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

  if (role == Role.MODERATOR) return <Moderation />;

  if (role == Role.TENANT) return <PostStack />;

  return <TenantStack />;
};
