import { ReportReason, Report } from "@prisma/client";
import { useState } from "react";
import { RouterInputs } from "../../../utils/trpc";
import { TableSelect } from "./TableSelect";
import { Select } from "../../shared/button/Select";
import { TextArea } from "../../shared/forms/TextArea";
import { Button } from "../../shared/button/Button";

type banData = RouterInputs["moderation"]["createBan"];

export interface BanModalProps {
  userId: string;
  reports: Report[];
  onBan: (banData: banData) => void;
}

export const BanModal = ({ userId, reports, onBan }: BanModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [banData, setBanData] = useState<banData>({
    userId: userId,
    reportIds: [],
    reason: reports[0]?.reason || ReportReason["SPAM"],
    comment: "",
  });
  const [error, setError] = useState({ reportIds: false, comment: false });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setBanData({
      ...banData,
      [event.target.name]: event.target.value,
    });
  };

  const handleBan = (banData: banData) => {
    const errors = { reportIds: false, comment: false };
    if (reports.length > 0 && banData.reportIds.length === 0) {
      errors.reportIds = true;
    }
    if (banData.comment.length === 0) {
      errors.comment = true;
    }
    // If at least one error is set to true..
    if (Object.values(errors).includes(true)) {
      setError(errors);
      return;
    }
    onBan(banData);
    setError({ reportIds: false, comment: true });
    setShowModal(false);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Button onClick={() => setShowModal(true)}>Ban</Button>
      {showModal && (
        <>
          <div className="fixed inset-0 z-50 flex h-full justify-center overflow-auto p-5">
            <div className="m-auto flex h-max w-2/3 flex-col space-y-6 rounded-lg bg-slate-50 p-10 shadow-lg">
              <p className="text-2xl">Ban user form</p>
              <Select
                label="Reason"
                value={banData.reason}
                options={
                  Object.keys(ReportReason) as Array<keyof typeof ReportReason>
                }
                onChange={(value) =>
                  setBanData({ ...banData, reason: value as ReportReason })
                }
              />
              {reports.length > 0 && (
                <div>
                  <TableSelect
                    reports={reports}
                    banData={banData}
                    setBanData={setBanData}
                  />
                  {error.reportIds && (
                    <p className="mt-1 text-red-500">
                      Please select at least one report
                    </p>
                  )}
                </div>
              )}

              <div className="w-full">
                <label
                  className={`${
                    error.comment ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  Comment
                </label>
                <TextArea
                  rows={3}
                  placeholder="Comment..."
                  onChange={handleChange}
                  value={banData.comment}
                  className={`${error.comment && "border-red-500"}`}
                />
                <textarea
                  rows={3}
                  name="comment"
                  onChange={handleChange}
                  value={banData.comment}
                  className={`block w-full rounded-md border p-3 shadow-sm outline-none ${
                    error.comment ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => setShowModal(false)}>Close</Button>
                <Button theme="danger" onClick={() => handleBan(banData)}>
                  Ban
                </Button>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </div>
  );
};
