import { Role } from "@prisma/client";
import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Administration } from "../../components/moderation/Administration";

export default function AdministrationInde() {
  return (
    <LoggedLayout title="Administration Panel | Leace" roles={[Role.ADMIN]}>
      <Administration />
    </LoggedLayout>
  );
}
