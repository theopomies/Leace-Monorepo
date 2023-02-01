import { Roles } from "@prisma/client";
import { trpc } from "../utils/trpc";
import { RoleSelector } from "./Web/RoleSelector";
import { PostStack } from "./Stack/PostStack";
import { TenantStack } from "./Stack/TenantStack";
import { Administration } from "./Moderation/Administration";
import { Moderation } from "./Moderation/Moderation";

export const Home = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  if (!session) return <div>Unreachable</div>;

  const role = session.user.role;

  if (role == Roles.NONE) return <RoleSelector />;

  if (role == Roles.ADMIN) return <Administration />;

  if (role == Roles.MODERATOR) return <Moderation />;

  if (role == Roles.TENANT) return <PostStack />;

  return <TenantStack />;
};
