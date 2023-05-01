/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { Message, User } from "@prisma/client";
import { ChatMessage } from "./ChatMessage";
import { ChatInputMatch } from "./ChatInputMatch";
import { ChatInputSupport } from "./ChatInputSupport";

export interface ChatBoxProps {
  conversationId: string;
  userId: string;
  chatOn?: boolean;
  messages: (Message & { sender: User })[];
  isModeration?: boolean;
}

export const ChatBox = ({
  conversationId,
  userId,
  chatOn = false,
  messages,
  isModeration = false,
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
        {isModeration ? (
          chatOn && <ChatInputSupport conversationId={conversationId} />
        ) : (
          <ChatInputMatch conversationId={conversationId} />
        )}
      </div>
    </div>
  );
};
