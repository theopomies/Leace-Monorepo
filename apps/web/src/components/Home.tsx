import { Roles } from "@prisma/client";
import { trpc } from "../utils/trpc";
import { RoleSelector } from "./Web/RoleSelector";
import { PostStack } from "./stack/PostStack";
import { TenantStack } from "./stack/TenantStack";
import { Administration } from "./moderation/Administration";
import { Moderation } from "./moderation/Moderation";

export const Home = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  if (!session) return <div>Unreachable</div>;

  const role = session.role;

  if (role == undefined) return <RoleSelector />;

  if (role == Roles.ADMIN) return <Administration />;

  if (role == Roles.MODERATOR) return <Moderation />;

  if (role == Roles.TENANT) return <PostStack />;

  return <TenantStack />;
};
