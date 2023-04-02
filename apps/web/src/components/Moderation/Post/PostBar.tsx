/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";

export interface PostBarProps {
  postId: string;
  title: string;
  desc: string;
  type: string;
}

export const PostBar = ({ postId, title, desc, type }: PostBarProps) => {
  const { data: img } = trpc.image.getSignedPostUrl.useQuery(postId);

  return (
    <div className="flex w-full overflow-hidden rounded-xl bg-white shadow-md">
      {img && img[0] && (
        <div className="w-2/5">
          <img
            className="h-full object-cover"
            src={
              "https://ca-times.brightspotcdn.com/dims4/default/b13999c/2147483647/strip/false/crop/2000x1310+0+0/resize/1486x973!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F64%2Ffa%2Fc73b21106f904cb4a6893bedbe7c%2Fla-home-of-the-week-20180425-005" ||
              img[0].url
            }
            alt="Modern building architecture"
          />
        </div>
      )}

      <div className="w-3/5 p-5">
        <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
          {title}
        </div>
        <div className="mt-1 text-lg font-medium leading-tight text-black">
          {desc}
        </div>
        <p className="mt-2 text-slate-500">{type}</p>
      </div>
    </div>
  );
};
