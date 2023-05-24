/* eslint-disable @next/next/no-img-element */
import { Message, User } from "@prisma/client";

export interface MessageWithSender extends Message {
  sender: User;
}

export interface ChatMessageProps {
  userId: string;
  message: MessageWithSender;
}

export const ChatMessage = ({ userId, message }: ChatMessageProps) => {
  return (
    <div className="grid grid-cols-12 gap-y-2">
      {message.senderId === userId ? (
        <div className="col-start-6 col-end-13 rounded-lg p-3">
          <div className="flex flex-row-reverse items-center justify-start">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase">
              <img
                src={message.sender.image || "/defaultImage.png"}
                referrerPolicy="no-referrer"
                alt="image"
                className="mx-auto h-full rounded-full"
              />
            </div>
            <div className="mr-3 flex w-fit break-words rounded-xl bg-indigo-100 py-2 px-4 text-sm shadow">
              {message.content}
            </div>
          </div>
        </div>
      ) : (
        <div className="col-start-1 col-end-8 rounded-lg p-3">
          <div className="flex flex-row items-center">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase">
              <img
                src={message.sender.image || "/defaultImage.png"}
                referrerPolicy="no-referrer"
                alt="image"
                className="mx-auto h-full rounded-full"
              />
            </div>
            <div className="ml-3 flex w-fit break-words rounded-xl bg-white py-2 px-4 text-sm shadow">
              {message.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
