import RelationShips from "../../components/Chat/Chat";
import { trpc } from "../../utils/trpc";

const Support = () => {
  const session = trpc.auth.getSession.useQuery();

  if (session.data) {
    return (
      <div className="flex h-[calc(100vh-44px)] justify-center p-6">
        <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
          <RelationShips userId={session.data.user.id} chatOn />
        </div>
      </div>
    );
  }
};

export default Support;
