/* eslint-disable @next/next/no-img-element */
import { RelationType, User } from "@prisma/client";
import { Button } from "../button/Button";

export interface PostBarActionsProps {
  postId: string;
  relationType?: RelationType;
  relationshipId: string;
  user?: User;
  onDeleteMatch: (relationshipId: string) => void;
  onLikeMatch?: (postId: string) => void;
}

export const PostBarActions = ({
  postId,
  relationType,
  relationshipId,
  user,
  onDeleteMatch,
  onLikeMatch,
}: PostBarActionsProps) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 px-8 py-4">
      <Button theme="danger" onClick={() => onDeleteMatch(relationshipId)}>
        Delete Match
      </Button>
      {onLikeMatch &&
        user &&
        user.isPremium &&
        relationType != RelationType.MATCH && (
          <Button theme="success" onClick={() => onLikeMatch(postId)}>
            Like Match
          </Button>
        )}
    </div>
  );
};
