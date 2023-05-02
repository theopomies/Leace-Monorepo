/* eslint-disable @next/next/no-img-element */
import {
  Conversation,
  Message,
  Post,
  Relationship,
  SupportRelationship,
  User,
  Role,
} from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { SupportButton } from "./SupportButton";

export type relationshipsType =
  | (Relationship & {
      user: User;
      conversation: (Conversation & { messages: Message[] }) | null;
      post: Post & { createdBy: User };
    })[]
  | undefined;

export type supportRelationshipsType =
  | (SupportRelationship & {
      user: User;
      support: User;
      conversation: (Conversation & { messages: Message[] }) | null;
    })[]
  | undefined;

export interface ChatListProps {
  userId: string;
  conversationId: string;
  setConversationId: React.Dispatch<React.SetStateAction<string>>;
  relationships?: relationshipsType;
  supportRelationships?: supportRelationshipsType;
}

export const ChatList = ({
  userId,
  conversationId,
  setConversationId,
  relationships,
  supportRelationships,
}: ChatListProps) => {
  const { data: session } = trpc.auth.getSession.useQuery();

  if (!session || !session.role) return null;

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
          <div className="flex gap-2">
            {supportRelationships && (
              <span className="flex w-4 items-center justify-center rounded-full bg-indigo-300">
                {supportRelationships.length}
              </span>
            )}
            {session.role !== Role.ADMIN && session.role !== Role.MODERATOR && (
              <span className="flex w-4 items-center justify-center rounded-full bg-gray-300">
                {relationships ? relationships.length : 0}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex h-full w-full flex-col space-y-1">
          {supportRelationships?.map((supportRelationship) => (
            <button
              key={supportRelationship.id}
              className={`flex flex-row items-center rounded-xl p-2 hover:bg-gray-100 ${
                conversationId === supportRelationship.conversation?.id &&
                "bg-gray-100"
              } focus:outline-none`}
              onClick={() => {
                if (supportRelationship.conversation)
                  setConversationId(supportRelationship.conversation.id);
              }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase">
                <img
                  src={
                    supportRelationship.user.id === userId
                      ? supportRelationship.support.image || "/defaultImage.png"
                      : supportRelationship.user.image || "/defaultImage.png"
                  }
                  referrerPolicy="no-referrer"
                  alt="image"
                  className="mx-auto h-full rounded-full"
                />
              </div>
              <div className="ml-2 text-sm font-semibold">
                {supportRelationship.user.id === userId ? (
                  <span className=" text-indigo-500">
                    {supportRelationship.support.firstName} Support Leace
                  </span>
                ) : (
                  `${supportRelationship.user.firstName} ${supportRelationship.user.lastName}`
                )}
              </div>
            </button>
          ))}
          {relationships?.map((relationship) => (
            <button
              key={relationship.id}
              className={`flex flex-row items-center rounded-xl p-2 hover:bg-gray-100 ${
                conversationId === relationship.conversation?.id &&
                "bg-gray-100"
              } focus:outline-none`}
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
            </button>
          ))}
        </div>
      </div>
      <SupportButton
        userId={userId}
        role={session.role}
        setConversationId={setConversationId}
      />
    </div>
  );
};
