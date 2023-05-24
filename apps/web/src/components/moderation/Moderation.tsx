import { Loader } from "../shared/Loader";
import { trpc } from "../../utils/trpc";
import { Post } from "./post";
import { User } from "./user";
import { Report } from "./report";

export const Moderation = () => {
  const report = trpc.moderation.report.getReport.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (report.isLoading) {
    return <Loader />;
  }

  if (report && report.data && !report.error) {
    return (
      <div className="flex w-full">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="flex w-3/5 justify-center py-5">
          {report.data.userId && <User userId={report.data.userId} />}
          {report.data.postId && <Post postId={report.data.postId} />}
        </div>
        <div className="flex h-screen w-1/5 flex-col items-center justify-center gap-5 px-10">
          {report.data.userId && <Report userId={report.data.userId} />}
          {report.data.postId && (
            <Report reportId={report.data.id} postId={report.data.postId} />
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-center">
      <p>No user or post reported</p>
    </div>
  );
};
