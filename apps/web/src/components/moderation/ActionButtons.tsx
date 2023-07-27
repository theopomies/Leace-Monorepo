import Link from "next/link";
import { Button } from "../shared/button/Button";
import { ReportButton } from "./report/ReportButton";
import { RejectReports } from "./report/RejectReports";
import { Ban } from "./ban";

export interface ActionButtons {
  reportId?: string;
  userId: string;
  conversationLink: string;
}

export const ActionButtons = ({
  reportId,
  userId,
  conversationLink,
}: ActionButtons) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-2">
      <Link href={conversationLink}>
        <Button theme="primary">View conversations</Button>
      </Link>
      {reportId && (
        <div className="flex w-full flex-col gap-2 border-t border-black pt-4">
          <p className="text-center text-xl">Report</p>
          <ReportButton reportId={reportId} />
          <RejectReports reportId={reportId} />
        </div>
      )}
      <div className="w-full border-t border-black" />
      <Ban userId={userId} />
    </div>
  );
};
