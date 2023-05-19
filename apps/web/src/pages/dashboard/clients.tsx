import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { OccupiedClientList } from "../../components/dashboard/OccupiedClientList";
import { Loader } from "../../components/shared/Loader";


export default function OccupiedClientPage() {
    const { data: session, isLoading } = trpc.auth.getSession.useQuery();

    if (isLoading) return <Loader />;

    return (
        <LoggedLayout title="Clients | Leace" roles={[Role.AGENCY]}>
            {!!session && <OccupiedClientList userId={session.userId} />}
        </LoggedLayout>
    );
}