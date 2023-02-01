/* eslint-disable @next/next/no-img-element */
import {
  Conversation,
  Message,
  Post,
  Relationship,
  User,
} from "@prisma/client";

export interface ChatListProps {
  userId: string;
  relationships: (Relationship & {
    user: User;
    conversation: (Conversation & { messages: Message[] }) | null;
    post: Post & { createdBy: User };
  })[];
  setConversationId: React.Dispatch<React.SetStateAction<string>>;
}

export const ChatList = ({
  userId,
  relationships,
  setConversationId,
}: ChatListProps) => {
  return (
    <div className="flex h-full w-1/5 flex-shrink-0 flex-col rounded-tl-lg rounded-bl-lg bg-white pb-6">
      <div className="flex w-full flex-row items-center justify-center rounded-tl-lg bg-indigo-500 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </div>
        <div className="ml-2 text-2xl font-bold">Leace</div>
      </div>
      <div className="mt-8 flex flex-col overflow-auto px-5">
        <div className="flex flex-row items-center justify-between pl-2 text-xs">
          <span className="font-bold">Conversations</span>
          <span className="flex w-4 items-center justify-center rounded-full bg-gray-300">
            {relationships.length}
          </span>
        </div>
        <div className="mt-4 flex h-full w-full flex-col space-y-1">
          {relationships.map((relationship) => (
            <button
              key={relationship.id}
              className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
              onClick={() => {
                if (relationship.conversation)
                  setConversationId(relationship.conversation.id);
              }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase">
                <img
                  src={
                    relationship.user.id === userId
                      ? relationship.post.createdBy.image || "/defaultImage.png"
                      : relationship.user.image || "/defaultImage.png"
                  }
                  referrerPolicy="no-referrer"
                  alt="image"
                  className="mx-auto h-full rounded-full"
                />
              </div>
              <div className="ml-2 text-sm font-semibold">
                {relationship.user.id === userId
                  ? `${relationship.post.createdBy.firstName} ${relationship.post.createdBy.lastName}`
                  : `${relationship.user.firstName} ${relationship.user.lastName}`}
              </div>
              <div className="ml-auto flex h-4 w-4 items-center justify-center rounded bg-red-500 text-xs leading-none text-white">
                {relationship.conversation?.messages?.length}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
