import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";

export interface RejectUserReportProps {
  userId: string;
}

export const RejectUserReports = ({ userId }: RejectUserReportProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.report.rejectUserReports.useMutation({
    onSuccess() {
      utils.moderation.report.getReport.invalidate();
    },
  });
  const handleClick = () => {
    mutation.mutate({ userId });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Button theme="danger" onClick={handleClick}>
        Reject
      </Button>
    </div>
  );
};
