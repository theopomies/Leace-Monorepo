import { Post, Role } from "@prisma/client";
import { ReactNode } from "react";
import { ChatBox } from "./ChatBox";
import { ChatList, Relationships, SupportRelationships } from "./ChatList";
import { MessageWithSender } from "./ChatMessage";

export type ChatProps = {
  userId: string;
  messages?: MessageWithSender[];
  onSend?: (content: string) => void;
  relationships?: Relationships;
  supportRelationships?: SupportRelationships;
  role: Role;
  conversationId?: string;
  conversationLink?: string;
  contact?: { name: string; link: string };
  additionnalBarComponent?: ReactNode;
  posts?: Post[];
  postId?: string;
};

export const Chat = ({
  userId,
  messages,
  onSend,
  contact,
  additionnalBarComponent,
  ...listParams
}: ChatProps) => {
  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
      <div className="flex h-full w-full text-gray-800 antialiased">
        <div className="flex w-full flex-row overflow-x-hidden">
          <ChatList {...listParams} userId={userId} />
          {messages !== undefined && (
            <ChatBox
              userId={userId}
              messages={messages}
              onSend={onSend}
              contact={contact}
              additionnalBarComponent={additionnalBarComponent}
            />
          )}
          {messages === undefined && (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-2xl">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
