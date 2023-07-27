import { ReportReason, Report } from "@prisma/client";
import { useState } from "react";
import { RouterInputs } from "../../../utils/trpc";
import { TableSelect } from "./TableSelect";
import { Select } from "../../shared/button/Select";
import { TextArea } from "../../shared/forms/TextArea";
import { Button } from "../../shared/button/Button";

type banData = RouterInputs["moderation"]["ban"]["createBan"];

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
      <Button theme="danger" onClick={() => setShowModal(true)}>
        Ban user
      </Button>
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
                  className={`text-sm text-gray-900 ${
                    error.comment ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  Comment
                </label>
                <TextArea
                  name="comment"
                  onChange={handleChange}
                  value={banData.comment}
                  overrideStyles
                  className={`${
                    error.comment
                      ? "ring-red-500 focus:ring-red-500"
                      : "ring-gray-300 focus:ring-indigo-500"
                  } mt-2 w-full rounded-lg p-2.5 text-start text-sm text-gray-900 ring-1 ring-inset focus:outline-none focus:ring-2`}
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button theme="danger" onClick={() => handleBan(banData)}>
                  Ban
                </Button>
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </div>
  );
};
