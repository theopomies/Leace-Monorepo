import { Role } from "@prisma/client";
import { LoggedLayout } from "../../components/layout/LoggedLayout";

// TODO

export default function SupportPage() {
  return (
    <LoggedLayout title="Support | Leace" roles={[Role.ADMIN]}>
      Lol
    </LoggedLayout>
  );
}
