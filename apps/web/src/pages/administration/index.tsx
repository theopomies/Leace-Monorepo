import { Role } from "@prisma/client";
import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { AdministrationPage } from "../../components/moderation/administration/AdministrationPage";

export default function AdministrationIndex() {
  return (
    <LoggedLayout title="Administration Panel | Leace" roles={[Role.ADMIN]}>
      <AdministrationPage />
    </LoggedLayout>
  );
}
