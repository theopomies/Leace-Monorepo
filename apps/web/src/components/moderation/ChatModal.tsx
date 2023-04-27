import { useState } from "react";
import { Chat } from "../shared/chat";
import { Button } from "../shared/button/Button";

export interface ChatModalProps {
  userId: string;
}

export const ChatModal = ({ userId }: ChatModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Button onClick={() => setShowModal(true)}>View conversations</Button>
      {showModal && (
        <>
          <div className="px-auto fixed inset-0 z-50 flex justify-center p-5">
            <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
              <Chat userId={userId} isModeration />
              <div className="mr-6 flex items-center justify-center gap-4">
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
