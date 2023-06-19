/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { User, Post, RelationType } from "@prisma/client";
import { UserBarActions } from "./UserBarActions";

export interface UserBarProps {
  matchedUser: User;
  matchedUserLink: string;
  post: Post;
  relationType?: RelationType;
  relationshipId?: string;
  user?: User;
  conversationId?: string;
  onDeleteMatch?: (relationshipId: string) => Promise<void>;
  onLikeMatch?: (matchedUserId: string, postId: string) => Promise<void>;
}

export const UserBar = ({
  matchedUser,
  matchedUserLink,
  post,
  relationType,
  relationshipId,
  user,
  conversationId,
  onDeleteMatch,
  onLikeMatch,
}: UserBarProps) => {
  return (
    <div className="mx-auto mb-5 flex flex-grow cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <Link href={matchedUserLink.replace("[userId]", matchedUser.id)}>
        <div className="md:flex">
          {matchedUser.image && (
            <div className="md:shrink-0">
              <img
                className="h-48 w-full object-cover md:h-full md:w-48"
                src={matchedUser.image}
                alt="User Image"
              />
            </div>
          )}
          <div className="p-8">
            <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
              {matchedUser.firstName}
            </div>
            <p className="mt-1 block text-lg font-medium leading-tight text-black">
              {matchedUser.lastName}
            </p>
            <p className="mt-2 text-slate-500">{matchedUser.description}</p>
          </div>
        </div>
        <div className="flex text-sm font-semibold uppercase tracking-wide">
          <p className="font-black text-black">{post.title}</p>
        </div>
      </Link>
      {onDeleteMatch && relationshipId && (
        <UserBarActions
          matchedUserId={matchedUser.id}
          relationshipId={relationshipId}
          relationType={relationType}
          postId={post.id}
          user={user}
          conversationId={conversationId}
          onDeleteMatch={onDeleteMatch}
          onLikeMatch={onLikeMatch}
        />
      )}
    </div>
  );
};
