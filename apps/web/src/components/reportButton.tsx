import React from "react";
import { ReportReason, ReportStatus } from "@prisma/client";
import { trpc } from "../utils/trpc";

const ReportButton = (props: { reportId: string }) => {
  const [selected, setSelected] = React.useState<ReportReason>();

  const utils = trpc.useContext();
  const mutation = trpc.moderation.updateReport.useMutation({
    onSuccess() {
      utils.moderation.getReport.invalidate();
    },
  });

  const handleClick = async () => {
    selected
      ? await mutation.mutateAsync({
          id: props.reportId,
          reason: selected,
          status: ReportStatus.REJECTED,
        })
      : await mutation.mutateAsync({
          id: props.reportId,
          status: ReportStatus.RESOLVED,
        });
  };

  return (
    <div className="flex w-1/5 flex-col items-center justify-center px-10">
      <label
        htmlFor="countries"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Selectionner un signalement
      </label>
      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value as ReportReason);
        }}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        <option>Pas de sanction</option>
        {(Object.keys(ReportReason) as Array<keyof typeof ReportReason>).map(
          (value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ),
        )}
      </select>
      <button
        className="mt-5 rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={handleClick}
      >
        Ok
      </button>
    </div>
  );
};

export default ReportButton;