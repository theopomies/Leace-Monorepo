import { ReportReason } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";
import { Select } from "../../shared/button/Select";

export interface ReportButtonProps {
  reportId: string;
}

export const ReportButton = ({ reportId }: ReportButtonProps) => {
  const [selected, setSelected] = useState<ReportReason>(ReportReason["SPAM"]);

  const utils = trpc.useContext();
  const mutation = trpc.moderation.report.updateReport.useMutation({
    onSuccess() {
      utils.moderation.report.getReport.invalidate();
    },
  });

  const handleClick = () => {
    mutation.mutate({
      id: reportId,
      reason: selected,
    });
  };

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Select
        value={selected}
        options={Object.keys(ReportReason) as Array<keyof typeof ReportReason>}
        onChange={(value) => {
          setSelected(value as ReportReason);
        }}
      />
      <Button onClick={handleClick}>Ok</Button>
    </div>
  );
};
