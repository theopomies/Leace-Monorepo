import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { RoleSelector } from "../users/RoleSelector";
import { PostStack } from "../stack/PostStack";
import { TenantStack } from "../stack/TenantStack";
import { Administration } from "../moderation/Administration";
import { Moderation } from "../moderation/Moderation";

export const Home = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  if (!session) return <div>Unreachable</div>;

  const role = session.role;

  if (role == undefined) return <RoleSelector userId={session.userId} />;

  if (role == Role.ADMIN) return <Administration />;

  if (role == Role.MODERATOR) return <Moderation />;

  if (role == Role.TENANT) return <PostStack />;

  return <TenantStack />;
};
