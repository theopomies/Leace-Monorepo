import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";

export const ModerationReportPage = () => {
  const router = useRouter();
  const reportQuery = trpc.moderation.report.getReport.useQuery(undefined, {
    retry: false,
    onSuccess: (report) => {
      if (report) {
        if (report.userId) {
          router.push(
            `/moderation/reports/${report.id}/users/${report.userId}`,
          );
        } else if (report.postId) {
          router.push(
            `/moderation/reports/${report.id}/posts/${report.postId}`,
          );
        }
      }
    },
  });

  if (!reportQuery.isLoading && !reportQuery.data) {
    return (
      <div className="flex w-full items-center justify-center">
        <p>No user or post reported</p>
      </div>
    );
  }

  return <Loader />;
};
