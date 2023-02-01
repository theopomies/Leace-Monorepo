/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { trpc } from "../../utils/trpc";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export interface ChatBoxProps {
  conversationId: string;
  userId: string;
  chatOn: boolean | undefined;
}

export const ChatBox = ({ conversationId, userId, chatOn }: ChatBoxProps) => {
  const router = useRouter();
  const messages = router.pathname.startsWith("/moderation")
    ? trpc.moderation.getMessages.useQuery({ conversationId: conversationId })
    : trpc.conversation.getMessages.useQuery({
        conversationId: conversationId,
      });
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
            {messages &&
              messages.data &&
              messages.data.map((message) => (
                <ChatMessage
                  key={message.id}
                  userId={userId}
                  message={message}
                />
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
