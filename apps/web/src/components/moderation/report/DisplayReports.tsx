import { Report } from "@prisma/client";
import { displayDate } from "../../../utils/displayDate";
import { StatusSpan } from "./StatusSpan";

export interface DisplayReportsProps {
  reports: Report[];
}

export const DisplayReports = ({ reports }: DisplayReportsProps) => {
  return reports.length > 0 ? (
    <div className="border-blueGray-200 mt-10 border-t pt-10">
      <p className="mb-2 text-lg">Reports :</p>
      <div className="flex flex-wrap">
        {reports.map((report, index) => (
          <div key={index} className="flex items-center gap-2">
            <StatusSpan report={report} />
            <p>
              {displayDate(report.createdAt)}, reported for {report.reason} by
              {report.createdById}
            </p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="border-blueGray-200 mt-10 flex justify-center border-t pt-10">
      <p className="mb-2">No report</p>
    </div>
  );
};
