import {
  Conversation,
  Post,
  Relationship,
  Role,
  SupportRelationship,
  User,
} from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { Select } from "../button/Select";
import { UserImage } from "../user/UserImage";
import { SupportButton } from "./SupportButton";

export type Relationships =
  | (Relationship & {
      user: User;
      conversation: Conversation | null;
      post: Post & { createdBy: User };
    })[]
  | undefined;

export type SupportRelationships =
  | (SupportRelationship & {
      user: User;
      support: User;
      conversation: Conversation | null;
    })[]
  | undefined;

export interface ChatListProps {
  userId: string;
  conversationId?: string;
  role: Role;
  relationships?: Relationships;
  supportRelationships?: SupportRelationships;
  conversationLink?: string;
  posts?: Post[];
  postId?: string;
}

export const ChatList = ({
  userId,
  conversationId,
  relationships,
  supportRelationships,
  role,
  posts,
  postId,
  conversationLink = "/users/[userId]/matches/[conversationId]",
}: ChatListProps) => {
  const router = useRouter();
  return (
    <div className="flex h-full w-1/5 flex-shrink-0 flex-col rounded-tl-lg rounded-bl-lg bg-white">
      {posts !== undefined && posts.length > 1 && (
        <div className=" border-t border-slate-300 p-6">
          <h3 className="text-center text-lg font-medium">See matches for</h3>
          <Select
            options={[{ value: "RESET", label: "Reset filter" }].concat(
              posts.map((post) => ({
                label: post.title || "Untitled post",
                value: post.id,
              })),
            )}
            value={postId}
            onChange={(value) => {
              if (value === "RESET") {
                if (conversationId)
                  router.push(`/users/${userId}/matches/${conversationId}`);
                else router.push(`/users/${userId}/matches`);
                return;
              }
              if (conversationId)
                router.push(
                  `/users/${userId}/matches/${conversationId}?postId=${value}`,
                );
              else router.push(`/users/${userId}/matches?postId=${value}`);
            }}
            placeholder="Select a post to filter matches"
          />
        </div>
      )}
      <div className="mt-8 flex flex-shrink flex-grow flex-col overflow-auto px-5">
        <div className="flex flex-row items-center justify-between pl-2 text-xs">
          <h1 className="text-xl">Conversations</h1>
          <div className="flex gap-2">
            {((supportRelationships && supportRelationships.length !== 0) ||
              role === Role.ADMIN ||
              role === Role.MODERATOR) && (
              <span className="flex w-4 items-center justify-center rounded-full bg-indigo-300">
                {supportRelationships ? supportRelationships.length : 0}
              </span>
            )}
            {role !== Role.ADMIN && role !== Role.MODERATOR && (
              <span className="flex w-4 items-center justify-center rounded-full bg-gray-300">
                {relationships ? relationships.length : 0}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex h-full w-full flex-col gap-y-1">
          {supportRelationships?.map((supportRelationship) => (
            <Link
              href={conversationLink
                .replace("[userId]", userId)
                .replace(
                  "[conversationId]",
                  supportRelationship.conversation?.id || "",
                )}
              key={supportRelationship.id}
            >
              <button
                className={`flex h-14 w-full flex-grow rounded-xl p-2 text-left hover:bg-gray-100 ${
                  conversationId === supportRelationship.conversation?.id &&
                  "bg-gray-100"
                } focus:outline-none`}
              >
                {supportRelationship.user.id === userId ? (
                  <UserImage user={supportRelationship.support} />
                ) : (
                  <UserImage user={supportRelationship.user} />
                )}
                <p className="ml-3 flex h-full w-full items-center">
                  {supportRelationship.user.id === userId ? (
                    <span className=" text-indigo-500">
                      {supportRelationship.support.firstName} Support Leace
                    </span>
                  ) : (
                    `${supportRelationship.user.firstName} ${supportRelationship.user.lastName}`
                  )}
                </p>
              </button>
            </Link>
          ))}
          {relationships?.map((relationship) => (
            <Link
              href={conversationLink
                .replace("[userId]", userId)
                .replace(
                  "[conversationId]",
                  relationship.conversation?.id || "",
                )}
              key={relationship.id}
            >
              <button
                className={`flex h-14 w-full flex-grow rounded-xl p-2 text-left hover:bg-gray-100 ${
                  conversationId === relationship.conversation?.id &&
                  "bg-gray-100"
                } focus:outline-none`}
              >
                <UserImage
                  user={
                    relationship.user.id === userId
                      ? relationship.post.createdBy
                      : relationship.user
                  }
                />
                <p
                  className={`${
                    relationship.post.title &&
                    relationship.post.title.length > 30 &&
                    "line-clamp-2"
                  } 
                    ${relationship.user.id === userId && "text-[0.8em]"}
                    ml-3 flex h-full w-full items-center`}
                >
                  {relationship.user.id === userId
                    ? `${relationship.post.title || "Untitled Post"} - ${
                        relationship.post.createdBy.firstName
                      }`
                    : `${relationship.user.firstName} ${relationship.user.lastName}`}
                </p>
              </button>
            </Link>
          ))}
        </div>
      </div>
      {supportRelationships === undefined ||
        (supportRelationships.length === 0 && (
          <SupportButton
            userId={userId}
            role={role}
            conversationLink={conversationLink}
          />
        ))}
    </div>
  );
};
