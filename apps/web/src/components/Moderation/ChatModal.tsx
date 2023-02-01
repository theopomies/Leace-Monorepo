import { useState } from "react";
import { Chat } from "../Chat";

export interface ChatModalProps {
  userId: string;
}

export const ChatModal = ({ userId }: ChatModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-center px-10">
      <button
        className="rounded-full bg-blue-500  py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        Voir les conversations
      </button>
      {showModal && (
        <>
          <div className="px-auto fixed inset-0 z-50 flex justify-center p-5">
            <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
              <Chat userId={userId} />
              <div className="mr-6 flex items-center justify-center gap-4">
                <button
                  className="rounded-full bg-slate-400 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:shadow-lg focus:outline-none"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </div>
  );
};
