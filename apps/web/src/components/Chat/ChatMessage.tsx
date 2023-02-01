/* eslint-disable @next/next/no-img-element */
import { Message, User } from "@prisma/client";

export interface ChatMessageProps {
  userId: string;
  message: Message & { sender: User };
}

export const ChatMessage = ({ userId, message }: ChatMessageProps) => {
  return (
    <div key={message.id} className="grid grid-cols-12 gap-y-2">
      {message.senderId === userId ? (
        <div className="col-start-6 col-end-13 rounded-lg p-3">
          <div className="flex flex-row-reverse items-center justify-start">
            <div
              className={`${
                !message.sender.image && "bg-indigo-500"
              } flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase`}
            >
              {message.sender.image ? (
                <img
                  src={message.sender.image}
                  referrerPolicy="no-referrer"
                  alt="image"
                  className="mx-auto h-full rounded-full"
                />
              ) : (
                message.sender.firstName?.charAt(0)
              )}
            </div>
            <div className="mr-3 flex w-fit break-words rounded-xl bg-indigo-100 py-2 px-4 text-sm shadow">
              {message.content}
            </div>
          </div>
        </div>
      ) : (
        <div className="col-start-1 col-end-8 rounded-lg p-3">
          <div className="flex flex-row items-center">
            <div
              className={`${
                !message.sender.image && "bg-indigo-500"
              } flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase`}
            >
              {message.sender.image ? (
                <img
                  src={message.sender.image}
                  referrerPolicy="no-referrer"
                  alt="image"
                  className="mx-auto h-full rounded-full"
                />
              ) : (
                message.sender.firstName?.charAt(0)
              )}
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
