/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Button } from "../shared/button/Button";
import { trpc } from "../../utils/trpc";
import { Attribute, User, RelationType } from "@prisma/client";

export interface TenantBarProps {
  otherUserId: string;
  img: string;
  desc: string;
  firstname: string;
  lastName: string;
  relationType: RelationType;
  userId: string;
  relationshipId: string;
  postId: string;
  title: string;
  user:
    | (User & {
        attribute: Attribute | null;
      })
    | undefined;
}

export const TenantBar = ({
  otherUserId,
  img,
  desc,
  firstname,
  lastName,
  relationType,
  userId,
  relationshipId,
  postId,
  title,
  user,
}: TenantBarProps) => {
  const utils = trpc.useContext();
  const likeTenantForPost = trpc.relationship.likeTenantForPost.useMutation({
    onSuccess: () => {
      utils.relationship.getMatchesForOwner.invalidate({ userId });
      utils.relationship.getLikesForOwner.invalidate({ userId });
    },
  });

  const deleteMatchMutation =
    trpc.relationship.deleteRelationForOwner.useMutation({
      onSuccess: () => {
        utils.relationship.getMatchesForOwner.invalidate({ userId });
        utils.relationship.getLikesForOwner.invalidate({ userId });
      },
    });

  const handleDeleteMatch = async () => {
    await deleteMatchMutation.mutateAsync({ userId, relationshipId });
  };

  const handleLikeMatch = async () => {
    await likeTenantForPost.mutateAsync({
      userId: otherUserId,
      postId: postId,
    });
  };

  return (
    <div className="mx-auto my-5 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <Link href={`/users/${otherUserId}`}>
        <div className="md:flex">
          <div className="md:shrink-0">
            <img
              className="h-48 w-full object-cover md:h-full md:w-48"
              src={img}
              alt="Modern building architecture"
            />
          </div>
          <div className="p-8">
            <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
              {firstname}
            </div>
            <p className="mt-1 block text-lg font-medium leading-tight text-black">
              {lastName}
            </p>
            <p className="mt-2 text-slate-500">{desc}</p>
          </div>
        </div>
        <div className="flex text-sm font-semibold uppercase tracking-wide">
          <p className="font-black text-black"> {title} </p>
        </div>
      </Link>
      <div className="flex items-center justify-between bg-gray-100 px-8 py-4">
        <Button theme="danger" onClick={handleDeleteMatch}>
          Delete Match
        </Button>
        {relationType == RelationType.MATCH && (
          <Link
            className="rounded bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
            href={`/chat/all`}
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
