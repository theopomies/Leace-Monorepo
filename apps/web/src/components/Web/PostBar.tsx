/* eslint-disable @next/next/no-img-element */
import { Post, Attribute } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

export const PostBar = (props: {
  post: Post & { attribute: Attribute | null };
}) => {
  const router = useRouter();
  const img = trpc.image.GetSignedPostUrl.useQuery(props.post.id);

  return (
    <div
      className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl"
      onClick={() => {
        router.push({
          pathname: "/users/PostPage",
          query: { post: JSON.stringify(props.post) },
        });
      }}
    >
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={img.data && img.data[0] ? img.data[0].url : ""}
            alt="Modern building architecture"
          />
        </div>
        <div className="p-8">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {props.post.title}
          </div>
          <a
            href="#"
            className="mt-1 block text-lg font-medium leading-tight text-black hover:underline"
          >
            {props.post.type}
          </a>
          <p className="mt-2 text-slate-500">{props.post.desc}</p>
        </div>
      </div>
    </div>
  );
};
