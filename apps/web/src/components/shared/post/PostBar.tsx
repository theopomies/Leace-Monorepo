/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { Post, PostType, RelationType, User } from "@prisma/client";
import { PostBarActions } from "./PostBarActions";
import { PostBarUser } from "./PostBarUser";

export interface PostBarProps {
  post: Post;
  postLink: string;
  selected?: boolean;
  relationType?: RelationType;
  relationshipId?: string;
  conversationId?: string;
  user?: User;
  userLink?: string;
  onDeleteMatch?: (relationshipId: string) => void;
  onLikeMatch?: (postId: string) => void;
}

export const PostBar = ({
  post,
  postLink,
  selected,
  relationType,
  relationshipId,
  conversationId,
  user,
  userLink,
  onDeleteMatch,
  onLikeMatch,
}: PostBarProps) => {
  const { data: img } = trpc.image.getSignedPostUrl.useQuery({
    postId: post.id,
  });

  return (
    <div
      className={`${
        selected && "border border-indigo-500"
      } mx-auto mb-5 flex flex-grow cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl`}
    >
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
            className={`mx-5 my-auto w-full min-w-max ${
              (!img || !img[0]) && "py-6"
            }`}
          >
            <div className="flex w-full justify-between">
              <div className="font-semibold uppercase tracking-wide text-indigo-500">
                {post.title}
              </div>
              <div>13👍</div>
            </div>
            <p className="mt-2 text-slate-500">
              {post.type === PostType.RENTED
                ? "Rented ✅"
                : post.type === PostType.HIDE
                ? "On pause"
                : "Available"}
            </p>
          </div>
        </Link>
        {user && userLink && <PostBarUser user={user} userLink={userLink} />}
      </div>
      {relationshipId && onDeleteMatch && (
        <PostBarActions
          postId={post.id}
          relationType={relationType}
          relationshipId={relationshipId}
          conversationId={conversationId}
          user={user}
          onDeleteMatch={onDeleteMatch}
          onLikeMatch={onLikeMatch}
        />
      )}
    </div>
  );
};
