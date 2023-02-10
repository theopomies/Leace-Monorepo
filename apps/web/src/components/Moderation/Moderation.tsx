import { UserStatus } from "@prisma/client";
import { Loader } from "./Loader";
import { Profile } from "./Profile";
import { ReportButton } from "./ReportButton";
import { trpc } from "../../utils/trpc";
import { BanButtonModeration } from "./BanButton/BanButtonModeration";

export const Moderation = () => {
  const report = trpc.moderation.getReport.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });
  console.log(report);

  if (report.isLoading) {
    return <Loader />;
  } else if (report && report.data && !report.error) {
    return (
      <div className="flex w-full">
        <div className="flex w-1/5 items-center justify-center"></div>
        <div className="flex w-3/5 items-center justify-center">
          <Profile user={report.data.createdBy} />
        </div>
        <div className="flex w-1/5 flex-col items-center justify-center gap-5">
          <ReportButton reportId={report.data.id} />
          <BanButtonModeration
            userId={report.data.createdBy.id}
            isBanned={report.data.createdBy.status === UserStatus.BANNED}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full items-center justify-center">
        <p>Aucun utilisateur signalé</p>
      </div>
    );
  }
};
