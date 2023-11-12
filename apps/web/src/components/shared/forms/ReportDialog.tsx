import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../button/Button";
import { Select } from "../button/Select";
import { Dispatch, SetStateAction, useState } from "react";
import { TextArea } from "./TextArea";
import { ReportReason } from "@prisma/client";

export interface ReportDialogProps {
  fullName: string;
  onReport: (data: { reason: ReportReason; description: string }) => void;
  setOpen?: Dispatch<SetStateAction<boolean | undefined>>;
}

export function ReportDialog({
  fullName,
  onReport,
  setOpen,
}: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason>(ReportReason.SPAM);
  const [description, setDescription] = useState("");

  return (
    <Dialog.Root onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <p>Report Match</p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 opacity-70" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[70vh] -translate-x-[50%] -translate-y-[50%] rounded-xl bg-white p-8">
          <Dialog.Title asChild>
            <h1 className="p-4 text-xl">Report {fullName}</h1>
          </Dialog.Title>
          <div className="p-4">
            <Select
              label="Reason"
              value={reason}
              options={[
                ReportReason.SPAM,
                ReportReason.SCAM,
                ReportReason.INAPPROPRIATE,
                ReportReason.OTHER,
              ]}
              onChange={(str) => setReason(str as ReportReason)}
            />
          </div>
          <div className="p-4">
            <label className="flex flex-col">
              <p>Description</p>
              <TextArea
                value={description}
                placeholder="Please describe the reason for your report."
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Dialog.Close asChild>
              <Button theme="white">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button
                theme="danger"
                onClick={() => onReport({ reason, description })}
              >
                Report
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
