/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { trpc } from "../../utils/trpc";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const ChatBox = (props: {
  conversationId: string;
  userId: string;
  chatOn: boolean | undefined;
}) => {
  const messages = trpc.conversation.getMessages.useQuery({
    conversationId: props.conversationId,
  });
  const msgRef = useRef<null | HTMLDivElement>(null);
  console.log(messages);
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
                  userId={props.userId}
                  message={message}
                />
              ))}
          </div>
        </div>
        {props.chatOn && props.conversationId && (
          <ChatInput
            userId={props.userId}
            conversationId={props.conversationId}
          />
        )}
      </div>
    </div>
  );
};

export default ChatBox;
