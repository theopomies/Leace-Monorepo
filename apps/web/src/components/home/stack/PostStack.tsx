import { useEffect, useState } from "react";
import { Stack } from "./Stack";
import { StackElementProps } from "./StackElement";
import { useSession } from "@clerk/nextjs";
import { RouterOutputs, trpc } from "../../../utils/trpc";

export type Post = RouterOutputs["post"]["getPostsToBeSeen"];

export function PostStack() {
  const session = useSession();
  const [posts, setPosts] = useState([] as StackElementProps[]);
  const [lastPost, setLastPost] = useState<StackElementProps | null>();
  const { data, status } = trpc.post.getPostsToBeSeen.useQuery(
    { userId: session?.session?.user.id ?? "" },
    { enabled: posts.length <= 3 },
  );
  const { mutateAsync: dislikeHander } =
    trpc.relationship.dislikePostForTenant.useMutation();
  const { mutateAsync: likeHandler } =
    trpc.relationship.likePostForTenant.useMutation();

  useEffect(() => {
    if (status === "success") {
      const formatedData = data.map((post) => ({
        id: post.id,
        img: post.images[0]?.ext ?? "/sample_image.avif",
        title: post.title,
        description: post.content,
        onReport: () => console.log("Reported"),
        price: post.attribute?.price,
        region: post.attribute?.location,
      }));
      setPosts(formatedData as StackElementProps[]);
    }
  }, [data, status]);

  const removePost = (post: StackElementProps) => {
    setPosts((posts) => {
      const newPosts = posts.filter((p) => p.id !== post.id);
      return newPosts;
    });
  };

  const onLike = async (post: StackElementProps) => {
    await likeHandler({
      postId: post.id,
      userId: session?.session?.user.id ?? "",
    });
    removePost(post);
    setLastPost(post);
  };

  const onDislike = async (post: StackElementProps) => {
    await dislikeHander({
      postId: post.id,
      userId: session?.session?.user.id ?? "",
    });
    setLastPost(post);
    removePost(post);
  };

  const onRewind = () => {
    if (lastPost) {
      setPosts((posts) => [lastPost, ...posts]);
      setLastPost(null);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Stack
        posts={posts}
        onDislike={onDislike}
        onLike={onLike}
        onRewind={onRewind}
      />
    </div>
  );
}
