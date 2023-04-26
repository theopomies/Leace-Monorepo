import { trpc } from "../../../utils/trpc";

export interface RejectPostReportProps {
  postId: string;
}

export const RejectPostReports = ({ postId }: RejectPostReportProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.rejectPostReports.useMutation({
    onSuccess() {
      utils.moderation.getReport.invalidate();
    },
  });
  const handleClick = () => {
    mutation.mutate({ postId });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <button
        className="rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
        onClick={handleClick}
      >
        Reject
      </button>
    </div>
  );
};
