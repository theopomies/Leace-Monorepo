import { ReportStatus, Report } from "@prisma/client";

export interface StatusSpanProps {
  report: Report;
}

export const StatusSpan = ({ report }: StatusSpanProps) => {
  return (
    <span
      className={`inline-flex w-20 justify-center rounded-full px-2 text-xs font-semibold leading-5 ${
        report.status === ReportStatus.PENDING
          ? "bg-yellow-100 text-yellow-800"
          : report.status === ReportStatus.RESOLVED
          ? "bg-green-100 text-green-800"
          : report.status === ReportStatus.REJECTED && "bg-red-100 text-red-800"
      }`}
    >
      {report.status}
    </span>
  );
};
