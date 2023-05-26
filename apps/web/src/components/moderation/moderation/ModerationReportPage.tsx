import { useEffect } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";

export const ModerationReportPage = () => {
  const report = trpc.moderation.report.getReport.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (report.isSuccess && report.data) {
      if (report.data.userId) {
        router.push(
          `/moderation/reports/${report.data.id}/users/${report.data.userId}`,
        );
      } else if (report.data.postId) {
        router.push(
          `/moderation/reports/${report.data.id}/posts/${report.data.postId}`,
        );
      }
    }
  }, [report.isSuccess, report.data, router]);

  if (!report.isLoading && !report.data) {
    return (
      <div className="flex w-full items-center justify-center">
        <p>No user or post reported</p>
      </div>
    );
  }

  return <Loader />;
};
