import { XOR } from "../../../utils/types";
import { ReportButton } from "./ReportButton";
import { BanPostAuthor } from "../Ban/BanPostAuthor";
import { Ban } from "../Ban";
import { RejectPostReports } from "./RejectPostReports";
import { RejectUserReports } from "./RejectUserReports";

export type ReportProps = XOR<
  { userId: string },
  { reportId: string; postId: string }
>;

export const Report = ({ userId, reportId, postId }: ReportProps) => {
  if (userId)
    return (
      <div className="flex w-full flex-row justify-between">
        <Ban userId={userId} />
        <RejectUserReports userId={userId} />
      </div>
    );
  if (reportId && postId)
    return (
      <>
        <ReportButton reportId={reportId} />
        <div className="flex w-full flex-row justify-between">
          <BanPostAuthor postId={postId} />
          <RejectPostReports postId={postId} />
        </div>
      </>
    );
  return null;
};
