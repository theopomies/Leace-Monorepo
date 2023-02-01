/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Loader } from "../Moderation/Loader";
import { ChatList } from "./ChatList";
import { ChatBox } from "./ChatBox";

export interface ChatProps {
  userId: string;
  chatOn?: boolean;
}

export const Chat = ({ userId, chatOn }: ChatProps) => {
  const router = useRouter();
  const [conversationId, setConversationId] = useState("");

  const relationships = router.pathname.startsWith("/moderation")
    ? trpc.moderation.getMatch.useQuery(chatOn ? undefined : { id: userId }, {
        onSuccess(data) {
          if (data && data[0] && data[0].conversation)
            setConversationId(data[0].conversation.id);
        },
      })
    : trpc.relationship.getMatch.useQuery(undefined, {
        onSuccess(data) {
          if (data && data[0] && data[0].conversation)
            setConversationId(data[0].conversation.id);
        },
      });

  if (relationships.isLoading) {
    return <Loader />;
  }
  if (!relationships || !relationships.data || relationships.error) {
    return <p>Aucune conversation</p>;
  }
  return (
    <div className="flex h-full w-full text-gray-800 antialiased">
      <div className="flex h-full w-full flex-row overflow-x-hidden">
        <ChatList
          userId={userId}
          relationships={relationships.data}
          setConversationId={setConversationId}
        />
        {conversationId && (
          <ChatBox
            conversationId={conversationId}
            userId={userId}
            chatOn={chatOn}
          />
        )}
      </div>
    </div>
  );
};
