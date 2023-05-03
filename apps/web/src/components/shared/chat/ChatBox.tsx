/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { Conversation, ConversationType, Message, User } from "@prisma/client";
import { ChatMessage } from "./ChatMessage";
import { ChatInputMatch } from "./ChatInputMatch";
import { ChatInputSupport } from "./ChatInputSupport";
import { EndOfConversation } from "./EndOfConversation";

export interface ChatBoxProps {
  userId: string;
  conversation: Conversation;
  messages: (Message & { sender: User })[];
  chatOn?: boolean;
  isSupport?: boolean;
}

export const ChatBox = ({
  userId,
  conversation,
  messages,
  chatOn = false,
  isSupport = false,
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
            {messages?.map((message) => (
              <ChatMessage key={message.id} userId={userId} message={message} />
            ))}
            <EndOfConversation conversation={conversation} />
          </div>
        </div>
        {conversation.type !== ConversationType.DONE &&
          (isSupport
            ? chatOn && <ChatInputSupport conversationId={conversation.id} />
            : chatOn && <ChatInputMatch conversationId={conversation.id} />)}
      </div>
    </div>
  );
};
