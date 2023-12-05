import Link from "next/link";
import { Button } from "../shared/button/Button";
import { ReportButton } from "./report/ReportButton";
import { RejectReports } from "./report/RejectReports";
import { Ban } from "./ban";
import { CertifyPostButtons } from "./certification/CertifyPostButton";

export interface ActionButtons {
  reportId?: string;
  userId: string;
  conversationLink?: string;
  postId?: string;
}

export const ActionButtons = ({
  reportId,
  userId,
  conversationLink,
  postId,
}: ActionButtons) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-2">
      {conversationLink && (
        <Link href={conversationLink}>
          <Button theme="primary">View conversations</Button>
        </Link>
      )}
      {postId && <CertifyPostButtons postId={postId} />}
      {reportId && (
        <div className="flex w-full flex-col gap-2  pt-4">
          <p className="text-center text-xl">Report</p>
          <ReportButton reportId={reportId} />
          <RejectReports reportId={reportId} />
        </div>
      )}
      <Ban userId={userId} />
    </div>
  );
};
