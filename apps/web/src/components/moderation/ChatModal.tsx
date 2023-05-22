import { useState } from "react";
import { Chat } from "../shared/chat/Chat";
import { Button } from "../shared/button/Button";
import { Cross } from "./Icons";

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
            <div className="flex w-full">
              <Chat userId={userId} isModeration />
              <div className="absolute right-0 top-0 p-5">
                <Button onClick={() => setShowModal(false)}>
                  <Cross />
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
