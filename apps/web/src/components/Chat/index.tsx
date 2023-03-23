/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ChatBoxMatch } from "./ChatBoxMatch";
import { ChatBoxModeration } from "./ChatBoxModeration";
import { ChatListMatch } from "./ChatListMatch";
import { ChatListModeration } from "./ChatListModeration";

export interface ChatProps {
  userId: string;
  chatOn?: boolean;
  isModeration?: boolean;
}

export const Chat = ({
  userId,
  chatOn = false,
  isModeration = false,
}: ChatProps) => {
  const [conversationId, setConversationId] = useState("");

  return (
    <div className="flex h-full w-full text-gray-800 antialiased">
      <div className="flex w-full flex-row overflow-x-hidden">
        {isModeration ? (
          <ChatListModeration
            userId={userId}
            setConversationId={setConversationId}
            chatOn={chatOn}
          />
        ) : (
          <ChatListMatch
            userId={userId}
            setConversationId={setConversationId}
          />
        )}
        {conversationId &&
          (isModeration ? (
            <ChatBoxModeration
              conversationId={conversationId}
              userId={userId}
              chatOn={chatOn}
            />
          ) : (
            <ChatBoxMatch
              conversationId={conversationId}
              userId={userId}
              chatOn={chatOn}
            />
          ))}
      </div>
    </div>
  );
};
