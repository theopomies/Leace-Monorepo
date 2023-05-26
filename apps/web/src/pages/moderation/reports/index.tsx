import { Role } from "@prisma/client";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { ModerationReportPage } from "../../../components/moderation/moderation/ModerationReportPage";

export default function ModerationReportView() {
  return (
    <LoggedLayout title="Moderation Report | Leace" roles={[Role.ADMIN]}>
      <ModerationReportPage />
    </LoggedLayout>
  );
}
