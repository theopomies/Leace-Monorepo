import { ReportReason } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";
import { Select } from "../../shared/button/Select";
import { useRouter } from "next/router";

export interface ReportButtonProps {
  reportId: string;
}

export const ReportButton = ({ reportId }: ReportButtonProps) => {
  const router = useRouter();
  const [selected, setSelected] = useState<ReportReason>(ReportReason["SPAM"]);

  const updateReport = trpc.moderation.report.updateReport.useMutation({
    onSuccess() {
      router.push("/moderation/reports");
    },
  });

  const handleClick = () => {
    updateReport.mutate({ reportId, reason: selected });
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
