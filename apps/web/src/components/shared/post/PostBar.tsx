/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { Post, PostType, RelationType, User } from "@prisma/client";
import { PostBarActions } from "./PostBarActions";

export interface PostBarProps {
  post: Post;
  postLink: string;
  relationType?: RelationType;
  relationshipId?: string;
  conversationId?: string;
  user?: User;
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
  OnDeleteMatch,
  OnLikeMatch,
}: PostBarProps) => {
  const { data: img } = trpc.image.getSignedPostUrl.useQuery(post.id);

  return (
    <div className="flex w-full cursor-pointer overflow-hidden rounded-xl bg-white shadow-md">
      <Link href={postLink.replace("[postId]", post.id)} className="flex">
        {img && img[0] && (
          <div className="w-2/5">
            <img
              className="h-full object-cover"
              src={img[0].url}
              alt="Modern building architecture"
            />
          </div>
        )}
        <div className="w-3/5 p-5">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {post.title}
          </div>
          <div className="mt-1 text-lg font-medium leading-tight text-black">
            {post.desc}
          </div>
          <p className="mt-2 text-slate-500">
            {post.type == PostType.RENTED ? "Rented ✅" : "Available"}
          </p>
        </div>
      </Link>
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
