import { Report } from "@prisma/client";
import { displayDate } from "../../../utils/displayDate";
import { StatusSpan } from "./StatusSpan";

export interface DisplayReportsProps {
  reports: Report[] | undefined;
}

export const DisplayReports = ({ reports }: DisplayReportsProps) => {
  return (
    <div className="border-t py-5">
      <p className="mb-5 text-xl">Reports :</p>
      {reports && reports.length > 0 ? (
        <div className="flex flex-wrap">
          {reports.map((report, index) => (
            <div key={index} className="flex items-center gap-2">
              <StatusSpan report={report} />
              <p>
                {displayDate(report.createdAt)}, reported for {report.reason} by{" "}
                {report.createdById}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No report</p>
      )}
    </div>
  );
};
