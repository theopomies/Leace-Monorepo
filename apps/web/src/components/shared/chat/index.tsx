/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ChatBoxMatch } from "./ChatBoxMatch";
import { ChatBoxModeration } from "./ChatBoxModeration";
import { ChatListMatchOwner } from "./ChatListMatchOwner";
import { ChatListMatchTenant } from "./ChatListMatchTenant";
import { ChatListModeration } from "./ChatListModeration";
import { XOR } from "../../../utils/types";

export type ChatProps = {
  userId: string;
  chatOn?: boolean;
} & XOR<{ isModeration?: boolean }, { isTenant: boolean }>;

export const Chat = ({
  userId,
  isTenant,
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
        ) : isTenant ? (
          <ChatListMatchTenant
            userId={userId}
            setConversationId={setConversationId}
          />
        ) : (
          <ChatListMatchOwner
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
