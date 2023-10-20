import { Role } from "@prisma/client";
import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { CertificationPage } from "../../components/moderation/certification/CertificationPage";

export default function ModerationReportIndex() {
  return (
    <LoggedLayout
      title="Certification | Leace"
      roles={[Role.ADMIN, Role.MODERATOR]}
    >
      <CertificationPage />
    </LoggedLayout>
  );
}
