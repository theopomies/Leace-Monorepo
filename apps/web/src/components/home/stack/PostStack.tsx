import { useRouter } from "next/router";
import { Stack } from "./Stack";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";
import { Post, Attribute, Image as ImagePrisma } from "@prisma/client";
import { Loader } from "../../shared/Loader";
import Link from "next/link";
import { Button } from "../../shared/button/Button";
import { StackButton } from "./StackButton";
import Image from "next/image";
import RewindSvg from "../../../../public/iconsButton/rewind.svg";

export type PostType = Post & {
  attribute: Attribute | null;
  images: (ImagePrisma & { url: string })[] | null;
};
export interface PostStackProps {
  userId: string;
}

export function PostStack({ userId }: PostStackProps) {
  const router = useRouter();
  const [posts, setPosts] = useState([] as PostType[]);
  const [lastPost, setLastPost] = useState<PostType | null>();
  const { data, status, isLoading } = trpc.post.getPostsToBeSeen.useQuery(
    { userId },
    { enabled: posts.length <= 3, retry: false },
  );
  const { data: user, isLoading: userIsLoading } =
    trpc.user.getUserById.useQuery({ userId });

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
      await rewindHandler({ postId: lastPost.id, userId });
      setLastPost(null);
    }
  };

  useEffect(() => {
    if (status === "success") {
      setPosts(data.postsToBeSeen);
    }
  }, [data, status]);

  if (isLoading || userIsLoading) {
    return <Loader />;
  }

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
      {user?.isPremium || !data?.postsIfPremium ? (
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
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-500">
            {data?.postsIfPremium} propert
            {data?.postsIfPremium && data?.postsIfPremium > 1
              ? "ies"
              : "y"}{" "}
            match with your criterias but have been posted in the last 24 hours.
            Subscribe to premium to see them in advance!
          </p>
          <Link href="/premium">
            <Button>Devenir premium</Button>
          </Link>
        </div>
      )}
      {lastPost && (
        <StackButton
          onClick={onRewind}
          className="hover:drop-shadow-rewind flex h-fit transform border-[#F7D332] transition-all duration-300 ease-in-out hover:scale-105"
        >
          <Image src={RewindSvg} alt="Rewind" width="40" height="40" />
        </StackButton>
      )}
    </div>
  );
}
