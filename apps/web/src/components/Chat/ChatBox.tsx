/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { Message, User } from "@prisma/client";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export interface ChatBoxProps {
  conversationId: string;
  userId: string;
  chatOn: boolean | undefined;
  messages: (Message & { sender: User })[];
}

export const ChatBox = ({
  conversationId,
  userId,
  chatOn,
  messages,
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
    <div className="flex h-full w-full flex-auto flex-col p-6">
      <div className="flex h-full w-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-100 p-4">
        <div ref={msgRef} className="flex h-full w-full flex-col overflow-auto">
          <div className="flex h-full flex-col">
            {messages.map((message) => (
              <ChatMessage key={message.id} userId={userId} message={message} />
            ))}
          </div>
        </div>
        {chatOn && conversationId && (
          <ChatInput conversationId={conversationId} />
        )}
      </div>
    </div>
  );
};
