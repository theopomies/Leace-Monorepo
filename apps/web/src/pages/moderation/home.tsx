import { useRouter } from "next/router";
import Loader from "../../components/loader";
import Profile from "../../components/profile";
import ReportButton from "../../components/reportButton";
import { trpc } from "../../utils/trpc";

const Home = () => {
  const { query } = useRouter();
  let user, report;

  if (query.uid) {
    user = trpc.moderation.getById.useQuery(query.uid.toString(), {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    });
  } else {
    report = trpc.moderation.getReport.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    });
  }
  if (report?.isLoading || user?.isLoading) {
    return <Loader />;
  } else if (
    (report && report.data && !report.error) ||
    (user && user.data && !user.error)
  ) {
    return (
      <div className="my-5 flex">
        <div className="justfy-center flex w-1/5 items-center"></div>
        <div className="flex max-h-[calc(100vh-84px)] w-3/5 items-center justify-center">
          {report?.data && <Profile user={report.data.createdBy} />}
          {user?.data && <Profile user={user.data} />}
        </div>
        {report && report.data && <ReportButton reportId={report.data.id} />}
      </div>
    );
  } else {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Aucun utilisateur signalé</p>
      </div>
    );
  }
};

export default Home;
