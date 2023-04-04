import { trpc } from "../../../utils/trpc";

export interface RejectUserReportProps {
  userId: string;
}

export const RejectUserReports = ({ userId }: RejectUserReportProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.moderation.rejectUserReports.useMutation({
    onSuccess() {
      utils.moderation.getReport.invalidate();
    },
  });
  const handleClick = () => {
    mutation.mutate({ userId });
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
