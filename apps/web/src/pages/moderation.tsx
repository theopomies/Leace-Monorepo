import { LoggedLayout } from "../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { Moderation } from "../components/moderation/Moderation";

export default function ModerationPage() {
  return (
    <LoggedLayout title="Moderation | Leace" roles={[Role.ADMIN]}>
      <Moderation />
    </LoggedLayout>
  );
}
