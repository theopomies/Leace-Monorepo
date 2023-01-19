import { UnBanButton, BanButton } from "../../components/banButton";
import Loader from "../../components/loader";
import Profile from "../../components/profile";
import ReportButton from "../../components/reportButton";
import { trpc } from "../../utils/trpc";

const Moderation = () => {
  const report = trpc.moderation.getReport.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (report?.isLoading) {
    return <Loader />;
  } else if (report && report.data && !report.error) {
    return (
      <div className="my-5 flex">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="flex max-h-[calc(100vh-84px)] w-3/5 items-center justify-center">
          <Profile user={report.data.createdBy} />
        </div>
        <div className="flex h-[calc(100vh-84px)] w-1/5 flex-col items-center justify-center">
          <ReportButton reportId={report.data.id} />
          <BanButton userId={report.data.createdBy.id} />
          <UnBanButton userId={report.data.createdBy.id} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-[calc(100vh-84px)] w-full items-center justify-center">
        <p>Aucun utilisateur signalé</p>
      </div>
    );
  }
};

export default Moderation;
