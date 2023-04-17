import { Role } from "@prisma/client";
import { LoggedLayout } from "../components/layout/LoggedLayout";
import { Support } from "../components/moderation/Support";

export default function SupportPage() {
  return (
    <LoggedLayout title="Support | Leace" roles={[Role.ADMIN]}>
      <Support />
    </LoggedLayout>
  );
}
