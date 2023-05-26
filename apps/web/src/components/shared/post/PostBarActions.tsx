/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { RelationType, User } from "@prisma/client";
import { Button } from "../button/Button";

export interface PostBarActionsProps {
  postId: string;
  relationType?: RelationType;
  relationshipId: string;
  conversationId?: string;
  user?: User;
  OnDeleteMatch: (relationshipId: string) => void;
  OnLikeMatch?: (postId: string) => void;
}

export const PostBarActions = ({
  postId,
  relationType,
  relationshipId,
  conversationId,
  user,
  OnDeleteMatch,
  OnLikeMatch,
}: PostBarActionsProps) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 px-8 py-4">
      <Button theme="danger" onClick={() => OnDeleteMatch(relationshipId)}>
        Delete Match
      </Button>
      {user && conversationId && relationType == RelationType.MATCH && (
        <Link
          className="rounded bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
          href={`/users/${user.id}/matches/${conversationId}`}
        >
          Chat with Match
        </Link>
      )}
      {OnLikeMatch &&
        user &&
        user.isPremium &&
        relationType != RelationType.MATCH && (
          <Button theme="success" onClick={() => OnLikeMatch(postId)}>
            Like Match
          </Button>
        )}
    </div>
  );
};
