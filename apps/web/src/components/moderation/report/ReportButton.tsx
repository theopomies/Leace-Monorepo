import { ReportReason } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";

export interface ReportButtonProps {
  reportId: string;
}

export const ReportButton = ({ reportId }: ReportButtonProps) => {
  const [selected, setSelected] = useState<ReportReason>(ReportReason["SPAM"]);

  const utils = trpc.useContext();
  const mutation = trpc.moderation.updateReport.useMutation({
    onSuccess() {
      utils.moderation.getReport.invalidate();
    },
  });

  const handleClick = () => {
    mutation.mutate({
      id: reportId,
      reason: selected,
    });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value as ReportReason);
        }}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
      >
        {(Object.keys(ReportReason) as Array<keyof typeof ReportReason>).map(
          (value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ),
        )}
      </select>
      <Button onClick={handleClick}>Ok</Button>
    </div>
  );
};
