/* eslint-disable @next/next/no-img-element */

import { trpc } from "../../utils/trpc";

export interface PostBarProps {
  postId: string;
  title: string;
  desc: string;
  type: string;
}

export const PostBar = ({ postId, title, desc, type }: PostBarProps) => {
  const { data: img } = trpc.image.GetSignedPostUrl.useQuery(postId);

  return (
    <div className="mx-auto my-5 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <div className="md:flex">
        {img && img[0] ? (
          <div className="md:shrink-0">
            <img
              className="h-48 w-full object-cover md:h-full md:w-48"
              src={img[0].url}
              alt="Modern building architecture"
            />
          </div>
        ) : (
          <></>
        )}

        <div className="p-8">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {title}
          </div>
          <a
            href="#"
            className="mt-1 block text-lg font-medium leading-tight text-black hover:underline"
          >
            {desc}
          </a>
          <p className="mt-2 text-slate-500">{type}</p>
        </div>
      </div>
    </div>
  );
};
