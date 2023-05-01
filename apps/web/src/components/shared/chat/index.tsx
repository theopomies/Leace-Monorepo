/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ChatBoxMatch } from "./ChatBoxMatch";
import { ChatBoxModeration } from "./ChatBoxModeration";
import { ChatListMatchOwner } from "./ChatListMatchOwner";
import { ChatListMatchTenant } from "./ChatListMatchTenant";
import { ChatListModeration } from "./ChatListModeration";
import { XOR } from "../../../utils/types";
import { ChatListSupport } from "./ChatListSupport";
import { ChatBoxSupport } from "./ChatBoxSupport";

export type ChatProps = {
  userId: string;
  chatOn?: boolean;
  isSupport?: boolean;
} & XOR<{ isModeration?: boolean }, { isTenant: boolean }>;

export const Chat = ({
  userId,
  chatOn = false,
  isSupport = false,
  isModeration = false,
  isTenant,
}: ChatProps) => {
  const [conversationId, setConversationId] = useState(""); // add value to make the diff between relationship and supportRelationship

  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
      <div className="flex h-full w-full text-gray-800 antialiased">
        <div className="flex w-full flex-row overflow-x-hidden">
          {isSupport ? (
            <ChatListSupport
              userId={userId}
              setConversationId={setConversationId}
            />
          ) : isModeration ? (
            <ChatListModeration
              userId={userId}
              setConversationId={setConversationId}
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
            (isSupport ? (
              <ChatBoxSupport
                conversationId={conversationId}
                userId={userId}
                chatOn={chatOn}
              />
            ) : isModeration ? (
              <ChatBoxModeration
                conversationId={conversationId}
                userId={userId}
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
    </div>
  );
};
