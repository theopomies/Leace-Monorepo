/* eslint-disable @next/next/no-img-element */
import { Post, Attribute } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { match } from "assert";

export const MatchBar = (props: {
  match: Post & { attribute: Attribute | null };
}) => {
  const router = useRouter();
  const img = trpc.image.GetSignedPostUrl.useQuery(props.match.id);

  return (
    <div
      className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl"
      onClick={() => {
        router.push({
          pathname: "/users/matchPage",
          query: { match: JSON.stringify(props.match) },
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
            {props.match.title}
          </div>
          <a
            href="#"
            className="mt-1 block text-lg font-medium leading-tight text-black hover:underline"
          >
            {props.match.type}
          </a>
          <p className="mt-2 text-slate-500">{props.match.desc}</p>
        </div>
      </div>
    </div>
  );
};
