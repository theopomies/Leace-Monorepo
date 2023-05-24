/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { PostType, RelationType } from "@prisma/client";
import { Button } from "../../shared/button/Button";
import { User, Attribute } from "@prisma/client";
export interface PostBarProps {
  postId: string;
  title: string;
  desc: string;
  type: PostType;
  relationType: RelationType;
  userId: string;
  relationshipId: string;
  conversationId?: string;
  user:
    | (User & {
        attribute: Attribute | null;
      })
    | undefined;
}

export const PostBar = ({
  postId,
  title,
  desc,
  type,
  relationType,
  userId,
  relationshipId,
  conversationId,
  user,
}: PostBarProps) => {
  const utils = trpc.useContext();
  const { data: img } = trpc.image.getSignedPostUrl.useQuery(postId);
  const likePostForTenant = trpc.relationship.likePostForTenant.useMutation({
    onSuccess: () => {
      utils.relationship.getMatchesForTenant.invalidate({ userId });
      utils.relationship.getLikesForTenant.invalidate({ userId });
    },
  });
  const deleteMatchMutation =
    trpc.relationship.deleteRelationForTenant.useMutation({
      onSuccess: () => {
        utils.relationship.getMatchesForTenant.invalidate({ userId });
        utils.relationship.getLikesForTenant.invalidate({ userId });
      },
    });

  const handleDeleteMatch = async () => {
    await deleteMatchMutation.mutateAsync({ userId, relationshipId });
  };
  const handleLikeMatch = async () => {
    await likePostForTenant.mutateAsync({
      userId: userId,
      postId: postId,
    });
  };

  return (
    <div className="mx-auto my-5 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <Link href={`/posts/${postId}`}>
        <div className="md:flex">
          {img && img[0] && (
            <div className="w-2/5">
              <img
                className="h-full object-cover"
                src={img[0].url}
                alt="Modern building architecture"
              />
            </div>
          )}

          <div className="p-8">
            <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
              {title}
            </div>
            <p className="mt-1 block text-lg font-medium leading-tight text-black">
              {desc}
            </p>
            <p className="mt-2 text-slate-500">
              {type == PostType.RENTED ? "Rented ✅" : "Available"}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between bg-gray-100 px-8 py-4">
        <Button theme="danger" onClick={handleDeleteMatch}>
          Delete Match
        </Button>
        {relationType == RelationType.MATCH && conversationId && (
          <Link
            className="rounded bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
            href={`/users/${userId}/matches/${conversationId}`}
          >
            Chat with Match
          </Link>
        )}
        {user && user.isPremium && relationType != RelationType.MATCH && (
          <Button theme="success" onClick={handleLikeMatch}>
            Like Match
          </Button>
        )}
      </div>
    </div>
  );
};
