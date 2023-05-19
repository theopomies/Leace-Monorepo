import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Dashboard } from "../../components/dashboard/Main";
import { Loader } from "../../components/shared/Loader";


export default function DashboardPage() {
    const { data: session, isLoading } = trpc.auth.getSession.useQuery();

    if (isLoading) return <Loader />;

    return (
        <LoggedLayout title="Dashboard | Leace" roles={[Role.AGENCY]}>
            {!!session && <Dashboard/>}
        </LoggedLayout>
    );
}