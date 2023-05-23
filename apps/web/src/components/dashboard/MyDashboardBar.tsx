/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { PostType } from "@prisma/client";
import { trpc } from "../../utils/trpc";

export interface PostBarProps {
  postId: string;
  title: string;
  desc: string;
  type: PostType;
  userId?: string;
  userFirstName?: string;
  userLastName?: string;
}

export const MyDashboardBar = ({
  postId,
  title,
  desc,
  type,
  userId,
  userFirstName,
  userLastName,
}: PostBarProps) => {
  const { data: img } = trpc.image.getSignedPostUrl.useQuery(postId);

  return (
    <div className="mx-auto my-5 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <div className="justify-between md:flex">
        <Link href={`/posts/${postId}`}>
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
              <p className="mt-1 block text-lg font-medium leading-tight text-black">
                {desc}
              </p>
              <p className="mt-2 text-slate-500">
                {type == PostType.RENTED ? "Rented ✅" : "Available"}
              </p>
            </div>
          </div>
        </Link>
        {userId && <div className="mx-4 border-l"></div>}
        {userId && (
          <Link href={`/users/${userId}`}>
            <div className="mr-10 md:flex">
              <div className="p-8">
                <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
                  {userFirstName ?? ""}
                </div>
                <p className="mt-1 block text-lg font-medium leading-tight text-black">
                  {userLastName ?? ""}
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
