import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Expenses } from "../../components/dashboard/Expenses";
import { Loader } from "../../components/shared/Loader";


export default function ExpensesPage() {
    const { data: session, isLoading } = trpc.auth.getSession.useQuery();

    if (isLoading) return <Loader />;

    return (
        <LoggedLayout title="Expenses | Leace" roles={[Role.AGENCY]}>
            {!!session && <Expenses/>}
        </LoggedLayout>
    );
}