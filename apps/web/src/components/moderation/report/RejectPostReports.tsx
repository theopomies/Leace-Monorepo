import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";

export interface RejectPostReportProps {
  postId: string;
}

export const RejectPostReports = ({ postId }: RejectPostReportProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.report.rejectPostReports.useMutation({
    onSuccess() {
      utils.moderation.report.getReport.invalidate();
    },
  });
  const handleClick = () => {
    mutation.mutate({ postId });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Button theme="danger" onClick={handleClick}>
        Reject
      </Button>
    </div>
  );
};
