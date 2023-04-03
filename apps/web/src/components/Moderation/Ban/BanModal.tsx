import { ReportReason, Report } from "@prisma/client";
import { useEffect, useState } from "react";
import { RouterInputs } from "../../../utils/trpc";
import { XOR } from "../../../utils/types";

type banData = XOR<
  RouterInputs["moderation"]["createBanUser"],
  RouterInputs["moderation"]["createBanUser"]
>;

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
  const [error, setError] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.target.value.length === 0) {
      setError(true);
    } else {
      setError(false);
    }

    setBanData({
      ...banData,
      [event.target.name]: event.target.value,
    });
  };

  const handleBan = (banData: banData) => {
    onBan(banData);
    setError(false);
    setShowModal(false);
  };

  useEffect(() => {
    if (reports) {
      setBanData((prevState) => ({
        ...prevState,
        reportIds: reports.map((report) => report.id),
      }));
    }
  }, [reports]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <button
        className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        Ban
      </button>
      {showModal && (
        <>
          <form
            onSubmit={() => handleBan(banData)}
            className="fixed inset-0 z-50 flex  items-center justify-center p-5"
          >
            <div className="space w-1/3 items-center justify-center space-y-6 rounded-lg bg-slate-50 p-10 shadow-lg">
              <p className="text-2xl">Select a sanction</p>
              <select
                value={banData.reason}
                onChange={(e) => {
                  setBanData({
                    ...banData,
                    reason: e.target.value as ReportReason,
                  });
                }}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              >
                {(
                  Object.keys(ReportReason) as Array<keyof typeof ReportReason>
                ).map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <div className="w-full">
                <label
                  className={`${error ? "text-red-500" : "text-gray-700"}`}
                >
                  Comment
                </label>
                <textarea
                  rows={3}
                  name="comment"
                  onChange={handleChange}
                  value={banData.comment}
                  className={`block w-full rounded-md border bg-gray-100 p-3 shadow-sm outline-none ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  className="rounded-full bg-slate-400 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none hover:bg-slate-500 hover:shadow-lg focus:outline-none"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  disabled={banData.comment.length === 0}
                  className="rounded-full bg-red-400 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none hover:bg-red-500 hover:shadow-lg focus:outline-none disabled:bg-slate-400"
                  type="submit"
                >
                  Ban
                </button>
              </div>
            </div>
          </form>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </div>
  );
};
