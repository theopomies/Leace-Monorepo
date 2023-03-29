import React, { useState } from "react";
import { trpc, RouterInputs } from "../../utils/trpc";
import { ReportReason } from ".prisma/client";
import { useRouter } from "next/router";

function ReportForm({
  onClose,
  userId,
}: {
  onClose: () => void;
  userId: string;
}) {
  const reportUser = trpc.report.reportUser.useMutation();
  const router = useRouter();
  const [ReportForm, setReportForm] = useState<
    RouterInputs["report"]["reportUser"]
  >({
    userId: userId,
    desc: "",
    reason: "SPAM",
  });
  const handleChange =
    (prop: string) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setReportForm({
        ...ReportForm,
        [prop]: event.target.value,
      });
    };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const report = await reportUser.mutateAsync(ReportForm);
    if (!report) {
      return null;
    }
    router.push("/");
  };
  return (
    <div className="fixed inset-x-0 bottom-0 px-4 pb-6 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div className="transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
        <form>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-4">
              <label
                className="block text-sm font-medium leading-5 text-gray-700"
                htmlFor="reason"
              >
                Signaler cet utilisateur
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <select
                  id="reason"
                  onChange={handleChange("reason")}
                  value={ReportForm.reason}
                  className="form-input block w-full rounded-md border-2 border-gray-300 bg-gray-50 p-2.5 py-2 px-3 text-sm leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none sm:text-sm sm:leading-5"
                >
                  <option value={undefined}>Pas de sanction</option>
                  {(
                    Object.keys(ReportReason) as Array<
                      keyof typeof ReportReason
                    >
                  ).map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-sm font-medium leading-5 text-gray-700"
                htmlFor="details"
              >
                Plus de détails
              </label>
              <div className="relative rounded-md shadow-sm">
                <textarea
                  id="details"
                  rows={3}
                  onChange={handleChange("desc")}
                  value={ReportForm.desc}
                  className="form-input block w-full rounded-md border-2 border-gray-300 bg-gray-50 p-2.5 py-2 px-3 text-sm leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none sm:text-sm sm:leading-5"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="submit"
                className="focus:shadow-outline-indigo inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-base font-medium leading-5 text-white hover:bg-indigo-500 focus:border-indigo-700 focus:outline-none active:bg-indigo-800"
                onClick={handleSubmit}
              >
                Confirmer
              </button>
            </span>
            <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
              <button
                type="button"
                className="focus:shadow-outline-blue inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-base font-medium leading-5 text-gray-700 hover:text-gray-500 focus:border-blue-300 focus:outline-none active:bg-gray-50 active:text-gray-800"
                onClick={onClose}
              >
                Annuler
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;
