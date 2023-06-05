import { Role } from "@prisma/client";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { ModerationReportPage } from "../../../components/moderation/moderation/ModerationReportPage";

export default function ModerationReportIndex() {
  return (
    <LoggedLayout
      title="Moderation Report | Leace"
      roles={[Role.ADMIN, Role.MODERATOR]}
    >
      <ModerationReportPage />
    </LoggedLayout>
  );
}
