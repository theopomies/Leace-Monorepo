/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { RelationType, User } from "@prisma/client";
import { Button } from "../button/Button";

export interface UserBarActionsProps {
  matchedUserId: string;
  relationshipId: string;
  relationType?: RelationType;
  postId?: string;
  user?: User;
  conversationId?: string;
  onDeleteMatch: (relationshipId: string) => void;
  onLikeMatch?: (matchedUserId: string, postId: string) => void;
}

export const UserBarActions = ({
  matchedUserId,
  relationshipId,
  relationType,
  postId,
  user,
  conversationId,
  onDeleteMatch,
  onLikeMatch,
}: UserBarActionsProps) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 px-8 py-4">
      <Button theme="danger" onClick={() => onDeleteMatch(relationshipId)}>
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
      {onLikeMatch &&
        user &&
        user.isPremium &&
        relationType != RelationType.MATCH &&
        postId && (
          <Button
            theme="success"
            onClick={() => onLikeMatch(matchedUserId, postId)}
          >
            Like Match
          </Button>
        )}
    </div>
  );
};
