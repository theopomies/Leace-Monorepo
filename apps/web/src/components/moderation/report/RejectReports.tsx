import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";

export interface RejectReportProps {
  reportId: string;
}

export const RejectReports = ({ reportId }: RejectReportProps) => {
  const router = useRouter();
  const rejectReports = trpc.moderation.report.rejectReports.useMutation({
    onSuccess() {
      router.push("/moderation/reports");
    },
  });

  const handleClick = async () => {
    await rejectReports.mutateAsync({ reportId });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Button onClick={handleClick} className="w-full">
        Reject
      </Button>
    </div>
  );
};
