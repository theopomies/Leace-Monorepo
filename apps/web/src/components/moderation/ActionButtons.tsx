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
  isCertified?: boolean;
}

export const ActionButtons = ({
  reportId,
  userId,
  conversationLink,
  postId,
  isCertified,
}: ActionButtons) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-2">
      {conversationLink && (
        <Button theme="primary" className="w-full">
          <Link href={conversationLink}>View conversations</Link>
        </Button>
      )}
      {postId && (
        <CertifyPostButtons postId={postId} isCertified={isCertified} />
      )}
      <Ban userId={userId} />
      {reportId && (
        <div className="flex w-full flex-col gap-2 border-t border-black pt-4">
          <h1 className="text-center text-xl">Validate report</h1>
          <ReportButton reportId={reportId} />
          <h1 className="text-center text-xl">Or</h1>
          <RejectReports reportId={reportId} />
        </div>
      )}
    </div>
  );
};
