/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { Message, User, ConversationType } from "@prisma/client";
import { ChatMessage } from "./ChatMessage";
import { ChatInputMatch } from "./ChatInputMatch";
import { ChatInputSupport } from "./ChatInputSupport";
import { EndOfConversation } from "./EndOfConversation";
import { trpc } from "../../../utils/trpc";

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
  const { data } = trpc.conversation.getType.useQuery({ conversationId }); // TODO is it possible to change this ? Balader conversation plutot que conversationId ?
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

  if (!data) return null;
  return (
    <div className="flex h-full w-full flex-auto flex-col p-6">
      <div className="flex h-full w-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-100 p-4">
        <div ref={msgRef} className="flex h-full w-full flex-col overflow-auto">
          <div className="flex h-full flex-col">
            {messages.map((message) => (
              <ChatMessage key={message.id} userId={userId} message={message} />
            ))}
            <EndOfConversation
              conversationId={conversationId}
              conversationType={data}
            />
          </div>
        </div>
        {data !== ConversationType.DONE &&
          (isModeration ? (
            chatOn && <ChatInputSupport conversationId={conversationId} />
          ) : (
            <ChatInputMatch conversationId={conversationId} />
          ))}
      </div>
    </div>
  );
};
