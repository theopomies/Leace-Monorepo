/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { Post, PostType, RelationType, User } from "@prisma/client";
import { PostBarActions } from "./PostBarActions";
import { PostBarUser } from "./PostBarUser";

export interface PostBarProps {
  post: Post;
  postLink: string;
  relationType?: RelationType;
  relationshipId?: string;
  conversationId?: string;
  user?: User;
  userLink?: string;
  OnDeleteMatch?: (relationshipId: string) => void;
  OnLikeMatch?: (postId: string) => void;
}

export const PostBar = ({
  post,
  postLink,
  relationType,
  relationshipId,
  conversationId,
  user,
  userLink,
  OnDeleteMatch,
  OnLikeMatch,
}: PostBarProps) => {
  const { data: img } = trpc.image.getSignedPostUrl.useQuery({
    postId: post.id,
  });

  return (
    <div className="mx-auto flex flex-grow cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <div className="flex items-center">
        <Link
          href={postLink.replace("[postId]", post.id)}
          className="flex w-full"
        >
          {img && img[0] && (
            <div className="h-full w-2/5">
              <img src={img[0].url} alt="Post image" className="object-cover" />
            </div>
          )}
          <div
            className={`my-auto mx-5 w-3/5 min-w-max ${
              (!img || !img[0]) && "py-6"
            }`}
          >
            <div className=" font-semibold uppercase tracking-wide text-indigo-500">
              {post.title}
            </div>
            <p className="mt-2 text-slate-500">
              {post.type == PostType.RENTED ? "Rented ✅" : "Available"}
            </p>
          </div>
        </Link>
        {user && userLink && <PostBarUser user={user} userLink={userLink} />}
      </div>
      {relationshipId && OnDeleteMatch && (
        <PostBarActions
          postId={post.id}
          relationType={relationType}
          relationshipId={relationshipId}
          conversationId={conversationId}
          user={user}
          OnDeleteMatch={OnDeleteMatch}
          OnLikeMatch={OnLikeMatch}
        />
      )}
    </div>
  );
};
