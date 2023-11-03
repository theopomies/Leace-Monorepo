import { useRouter } from "next/router";
import { Stack } from "./Stack";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";
import { Post, Attribute, Image } from "@prisma/client";

export type PostType = Post & { attribute: Attribute | null; images: Image[] };
export interface PostStackProps {
  userId: string;
}

export function PostStack({ userId }: PostStackProps) {
  const router = useRouter();
  const [posts, setPosts] = useState([] as PostType[]);
  const [lastPost, setLastPost] = useState<PostType | null>();
  const { data, status } = trpc.post.getPostsToBeSeen.useQuery(
    { userId },
    { enabled: posts.length <= 3 },
  );

  const { mutateAsync: likeHandler } =
    trpc.relationship.likePostForTenant.useMutation();
  const { mutateAsync: dislikeHandler } =
    trpc.relationship.dislikePostForTenant.useMutation();
  const { mutateAsync: rewindHandler } =
    trpc.relationship.rewindPostForTenant.useMutation();

  const removePost = (post: PostType) => {
    setPosts((posts) => {
      const newPosts = posts.filter((p) => p.id !== post.id);
      return newPosts;
    });
  };

  const onLike = async (post: PostType) => {
    removePost(post);
    await likeHandler({ postId: post.id, userId });
    setLastPost(post);
  };

  const onDislike = async (post: PostType) => {
    removePost(post);
    await dislikeHandler({ postId: post.id, userId });
    setLastPost(post);
  };

  const onRewind = async () => {
    if (lastPost) {
      setPosts((posts) => [lastPost, ...posts]);
      await rewindHandler({ userId });
      setLastPost(null);
    }
  };

  useEffect(() => {
    if (status === "success") {
      setPosts(data);
    }
  }, [data, status]);

  if (posts && posts.length > 0) {
    return (
      <Stack
        posts={posts}
        onDislike={onDislike}
        onLike={onLike}
        onRewind={onRewind}
      />
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-700">No results :(</h1>

      <div className="mt-4 flex flex-col items-center justify-center">
        <p className="text-gray-500">
          It seems that no one matches your current criterias ...
        </p>
        <p className="text-gray-500">
          Try to{" "}
          <a
            className="font-bold text-blue-500"
            onClick={() => router.push(`/users/${userId}/update`)}
            href="#"
          >
            modify
          </a>{" "}
          them or come back later !
        </p>
      </div>
    </div>
  );
}
