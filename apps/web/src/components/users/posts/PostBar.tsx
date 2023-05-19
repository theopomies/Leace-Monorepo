/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { PostType } from "@prisma/client";
import { Button } from "../../shared/button/Button";
export interface PostBarProps {
  postId: string;
  title: string;
  desc: string;
  type: PostType;
  userId: string;
  relationShipId: string;
}

export const PostBar = ({ postId, title, desc, type, userId, relationShipId }: PostBarProps) => {
  const utils = trpc.useContext();
  const { data: img } = trpc.image.getSignedPostUrl.useQuery(postId);
  const deleteMatchMutation = trpc.relationship.deleteMatchForTenant.useMutation({
    onSuccess: () => {
      utils.relationship.getMatchesForTenant.invalidate({ userId });
    },
  });

  const handleDeleteMatch = async () => {
    await deleteMatchMutation.mutateAsync({ userId, relationShipId });
  };

  return (
    <div className="mx-auto my-5 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <div className="md:flex">
        {img && img[0] && (
          <div className="md:shrink-0">
            <img
              className="h-48 w-full object-cover md:h-full md:w-48"
              src={img[0].url}
              alt="Modern building architecture"
            />
          </div>
        )}

        <div className="p-8">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {title}
          </div>
          <Link
            href={`/posts/${postId}`}
            className="mt-1 block text-lg font-medium leading-tight text-black hover:underline"
          >
            {desc}
          </Link>
          <p className="mt-2 text-slate-500">
            {type == PostType.RENTED ? "Rented ✅" : "Available"}
          </p>
        </div>
      </div>
        <Button theme="danger" onClick={handleDeleteMatch}>
          Delete Match
        </Button>
    </div>
  );
};
