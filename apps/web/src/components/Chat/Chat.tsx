/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import Loader from "../Moderation/Loader";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";

const Chat = (props: { userId: string; chatOn?: boolean }) => {
  const [conversationId, setConversationId] = useState("");

  // getMatch que pour la moderation
  const relationShips = trpc.moderation.getMatch.useQuery(
    props.chatOn ? undefined : { id: props.userId },
    {
      onSuccess(data) {
        if (data && data[0] && data[0].conversation)
          setConversationId(data[0].conversation.id);
      },
    },
  );

  if (relationShips?.isLoading) {
    return <Loader />;
  } else if (relationShips && relationShips.data && !relationShips.error) {
    return (
      <div className="flex h-full w-full text-gray-800 antialiased">
        <div className="flex h-full w-full flex-row overflow-x-hidden">
          <ChatList
            userId={props.userId}
            relationShips={relationShips.data}
            setConversationId={setConversationId}
          />
          {conversationId && (
            <ChatBox
              conversationId={conversationId}
              userId={props.userId}
              chatOn={props.chatOn}
            />
          )}
        </div>
      </div>
    );
  } else {
    return <p>Aucune conversation</p>;
  }
};

export default Chat;
