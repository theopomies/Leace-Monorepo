import { ReactNode, useEffect, useRef } from "react";
import { ChatMessage, MessageWithSender } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import Link from "next/link";

export interface ChatBoxProps {
  userId: string;
  messages: MessageWithSender[];
  onSend?: (content: string) => void;
  contact?: { name: string; link: string };
  additionnalBarComponent?: ReactNode;
}

export const ChatBox = ({
  userId,
  messages,
  onSend,
  contact,
  additionnalBarComponent,
}: ChatBoxProps) => {
  const msgRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  });

  return (
    <div className="flex flex-grow flex-col p-6">
      {contact && (
        <div className="flex items-center justify-between rounded-xl bg-white p-4">
          <Link href={contact.link} className=" underline">
            {contact.name}
          </Link>
          <div>{additionnalBarComponent}</div>
        </div>
      )}
      <div className="mt-4 flex flex-grow flex-col overflow-hidden rounded-2xl bg-gray-100 p-4">
        <div ref={msgRef} className="flex-grow overflow-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} userId={userId} message={message} />
          ))}
        </div>
        {onSend !== undefined && (
          <div className="flex-shrink-0">
            <ChatInput onSend={onSend} />
          </div>
        )}
      </div>
    </div>
  );
};
