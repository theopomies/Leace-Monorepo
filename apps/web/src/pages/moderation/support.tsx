import Loader from "../../components/moderation/Loader";
import RelationShips from "../../components/RelationShips";
import { trpc } from "../../utils/trpc";

const Moderation = () => {
  const relationShips = trpc.moderation.getMatch.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (relationShips?.isLoading) {
    return <Loader />;
  } else if (relationShips && relationShips.data && !relationShips.error) {
    return (
      <div className="flex h-[calc(100vh-44px)] justify-center p-6">
        <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
          <RelationShips
            userId={"cldhzdrel00004jx2z48b3tkt"}
            relationShips={relationShips.data}
            chatOn
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-[calc(100vh-44px)] w-full items-center justify-center">
        <p>Aucune conversation</p>
      </div>
    );
  }
};

export default Moderation;
