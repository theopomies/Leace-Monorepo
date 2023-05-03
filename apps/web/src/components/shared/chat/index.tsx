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
import { Conversation } from "@prisma/client";

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
  const [conversation, setConversation] = useState<Conversation>();

  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
      <div className="flex h-full w-full text-gray-800 antialiased">
        <div className="flex w-full flex-row overflow-x-hidden">
          {isSupport ? (
            <ChatListSupport
              userId={userId}
              conversation={conversation}
              setConversation={setConversation}
            />
          ) : isModeration ? (
            <ChatListModeration
              userId={userId}
              conversation={conversation}
              setConversation={setConversation}
            />
          ) : isTenant ? (
            <ChatListMatchTenant
              userId={userId}
              conversation={conversation}
              setConversation={setConversation}
            />
          ) : (
            <ChatListMatchOwner
              userId={userId}
              conversation={conversation}
              setConversation={setConversation}
            />
          )}
          {conversation &&
            (isSupport ? (
              <ChatBoxSupport
                conversation={conversation}
                userId={userId}
                chatOn={chatOn}
                isSupport
              />
            ) : isModeration ? (
              <ChatBoxModeration conversation={conversation} userId={userId} />
            ) : (
              <ChatBoxMatch
                conversation={conversation}
                userId={userId}
                chatOn={chatOn}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
