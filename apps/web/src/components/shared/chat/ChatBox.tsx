import { useEffect, useRef } from "react";
import { ChatMessage, MessageWithSender } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export interface ChatBoxProps {
  userId: string;
  messages: MessageWithSender[];
  onSend?: (content: string) => void;
}

export const ChatBox = ({ userId, messages, onSend }: ChatBoxProps) => {
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
    <div className="flex h-full w-full flex-auto flex-col p-6">
      <div className="flex h-full w-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-100 p-4">
        <div ref={msgRef} className="flex h-full w-full flex-col overflow-auto">
          <div className="flex h-full flex-col">
            {messages.map((message) => (
              <ChatMessage key={message.id} userId={userId} message={message} />
            ))}
          </div>
        </div>
        {onSend !== undefined && <ChatInput onSend={onSend} />}
      </div>
    </div>
  );
};
