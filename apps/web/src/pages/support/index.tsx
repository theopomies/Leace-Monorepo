import { Role } from "@prisma/client";
import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { SupportPage } from "../../components/moderation/SupportPage";

export default function Support() {
  return (
    <LoggedLayout title="Support | Leace" roles={[Role.ADMIN]}>
      <SupportPage />
    </LoggedLayout>
  );
}
