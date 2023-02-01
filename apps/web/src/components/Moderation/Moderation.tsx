import { UserStatus } from "@prisma/client";
import { UnBanButton, BanButton } from "./BanButton";
import { Loader } from "./Loader";
import { Profile } from "./Profile";
import { ReportButton } from "./ReportButton";
import { trpc } from "../../utils/trpc";

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
      <div className="my-5 flex">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="flex max-h-[calc(100vh-84px)] w-3/5 items-center justify-center">
          <Profile user={report.data.createdBy} />
        </div>
        <div className="flex h-[calc(100vh-84px)] w-1/5 flex-col items-center justify-center gap-5">
          <ReportButton reportId={report.data.id} />
          {report.data.createdBy.status == UserStatus.BANNED ? (
            <UnBanButton userId={report.data.createdBy.id} />
          ) : (
            <BanButton userId={report.data.createdBy.id} />
          )}
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
