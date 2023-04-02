import { Loader } from "../shared/Loader";
import { ReportButton } from "./ReportButton";
import { trpc } from "../../utils/trpc";
import { Post } from "./post";
import { User } from "./user";

export const Moderation = () => {
  const report = trpc.moderation.getReport.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (report.isLoading) {
    return <Loader />;
  } else if (report && report.data && !report.error) {
    return (
      <div className="flex w-full">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="flex w-3/5 justify-center py-5">
          {report.data.userId && <User userId={report.data.userId} />}
          {report.data.postId && <Post postId={report.data.postId} />}
        </div>
        <div className="flex h-screen w-1/5 flex-col items-center justify-center gap-5 px-10">
          <ReportButton reportId={report.data.id} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full items-center justify-center">
        <p>Aucun utilisateur ou post signalé</p>
      </div>
    );
  }
};
