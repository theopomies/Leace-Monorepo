import { Report, ReportStatus } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { displayDate } from "../../../utils/displayDate";
import { RouterInputs } from "../../../utils/trpc";

type banData = RouterInputs["moderation"]["createBan"];

interface TableSelectProps {
  reports: Report[];
  banData: banData;
  setBanData: Dispatch<SetStateAction<banData>>;
}

export const TableSelect = ({
  reports,
  banData,
  setBanData,
}: TableSelectProps) => {
  const handleCheckAll = () => {
    if (banData.reportIds.length === reports.length) {
      setBanData((prev) => ({ ...prev, reportIds: [] }));
    } else {
      setBanData((prev) => ({
        ...prev,
        reportIds: reports.map((report) => report.id),
      }));
    }
  };

  const handleSelect = (id: string) => {
    if (banData.reportIds.includes(id)) {
      setBanData((prev) => ({
        ...prev,
        reportIds: prev.reportIds.filter((reportId) => reportId !== id),
      }));
    } else {
      setBanData((prev) => ({
        ...prev,
        reportIds: [...prev.reportIds, id],
      }));
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                onChange={handleCheckAll}
                checked={banData.reportIds.length === reports.length}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Reason
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  onChange={() => handleSelect(report.id)}
                  checked={banData.reportIds.includes(report.id)}
                />
              </td>
              <td className="w-2/5 px-6 py-4">{report.desc}</td>
              <td className="px-6 py-4">{displayDate(report.createdAt)}</td>
              <td className="px-6 py-4">{report.reason}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    report.status === ReportStatus.PENDING
                      ? "bg-yellow-100 text-yellow-800"
                      : report.status === ReportStatus.RESOLVED
                      ? "bg-green-100 text-green-800"
                      : report.status === ReportStatus.REJECTED
                      ? "bg-red-100 text-red-800"
                      : ""
                  }`}
                >
                  {report.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
