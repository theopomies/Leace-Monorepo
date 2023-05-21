/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Button } from "../shared/button/Button";
import { trpc } from "../../utils/trpc";
import { Attribute } from "@prisma/client";
import { User } from "@leace/db";

export interface TenantBarProps {
  other_user_id: string;
  img: string;
  desc: string;
  firstname: string;
  lastName: string;
  userId: string;
  relationShipId: string;
  user:
    | (User & {
        attribute: Attribute | null;
      })
    | undefined;
}

export const TenantBar = ({
  other_user_id,
  img,
  desc,
  firstname,
  lastName,
  userId,
  relationShipId,
  user,
}: TenantBarProps) => {
  const utils = trpc.useContext();
  const deleteMatchMutation = trpc.relationship.deleteMatchForOwner.useMutation(
    {
      onSuccess: () => {
        utils.relationship.getLikesForOwner.invalidate({ userId });
      },
    },
  );

  const handleDeleteMatch = async () => {
    await deleteMatchMutation.mutateAsync({ userId, relationShipId });
  };

  const handleLikeMatch = async () => {
    // how to like a match
  };

  return (
    <div className="mx-auto my-5 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
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
          <Link
            href={`/users/${other_user_id}`}
            className="mt-1 block text-lg font-medium leading-tight text-black hover:underline"
          >
            {lastName}
          </Link>
          <p className="mt-2 text-slate-500">{desc}</p>
        </div>
      </div>
      <Button theme="danger" onClick={handleDeleteMatch}>
        Delete Match
      </Button>
      <Link
        className="rounded bg-indigo-500 px-4 py-3 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700"
        href={`/chat/all`}
      >
        Chat with Match
      </Link>
      {user && user.isPremium && (
        <Button theme="success" onClick={handleLikeMatch}>
          Like Match
        </Button>
      )}
    </div>
  );
};
