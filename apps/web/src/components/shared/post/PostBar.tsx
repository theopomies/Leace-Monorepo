/* eslint-disable @next/next/no-img-element */
import { trpc } from "../../../utils/trpc";
import { Post, PostType, RelationType, User } from "@prisma/client";
import { PostBarActions } from "./PostBarActions";
import { setCacheId } from "../../../utils/useCache";
import { useRouter } from "next/router";

export interface PostBarProps {
  post: Post;
  postLink: string;
  selected?: boolean;
  relationType?: RelationType;
  relationshipId?: string;
  conversationId?: string;
  user?: User;
  onDeleteMatch?: (relationshipId: string) => void;
  onLikeMatch?: (postId: string) => void;
}

export const PostBar = ({
  post,
  postLink,
  selected,
  relationType,
  relationshipId,
  user,
  onDeleteMatch,
  onLikeMatch,
}: PostBarProps) => {
  const router = useRouter();
  const { data: img } = trpc.image.getSignedPostUrl.useQuery({
    postId: post.id,
  });

  const handleClick = () => {
    setCacheId("lastSelectedPostId", post.id);
    router.push(postLink.replace("[postId]", post.id));
  };

  return (
    <div
      className={`${
        selected && "border border-indigo-500"
      } mx-auto mb-5 flex flex-grow cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl`}
    >
      <div className="flex items-center">
        <a onClick={handleClick} className="flex w-full flex-col">
          {img && img[0] && (
            <div className="w-full">
              <img
                src={img[0].url}
                alt="Post image"
                className="w-full object-cover"
              />
            </div>
          )}
          <div className={`my-3 mx-4 w-3/5 ${(!img || !img[0]) && "py-5"}`}>
            <div className="text-sm font-semibold text-indigo-500">
              {post.title}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {post.type === PostType.RENTED
                ? "Rented ✅"
                : post.type === PostType.HIDE
                ? "On pause"
                : "Available"}
            </p>
          </div>
        </a>
      </div>
      {relationshipId && onDeleteMatch && (
        <PostBarActions
          postId={post.id}
          relationType={relationType}
          relationshipId={relationshipId}
          user={user}
          onDeleteMatch={onDeleteMatch}
          onLikeMatch={onLikeMatch}
        />
      )}
    </div>
  );
};
