import { useRouter } from "next/router";
import Loader from "../../components/loader";
import Profile from "../../components/profile";
import ReportButton from "../../components/reportButton";
import { trpc } from "../../utils/trpc";

const Home = () => {
  const { query } = useRouter();

  const { data, isLoading, error } = query.uid
    ? trpc.moderation.getById.useQuery(query.uid.toString(), {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
      })
    : trpc.moderation.getReportedUser.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
      });

  return !isLoading ? (
    data && !error ? (
      <div className="flex h-screen">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="flex w-3/5 items-center justify-center">
          <Profile user={data} />
        </div>
        <ReportButton user={data} />
      </div>
    ) : (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Aucun utilisateur signalé</p>
      </div>
    )
  ) : (
    <Loader />
  );
};

export default Home;
