import { useEffect, useState } from "react";
import { Stack } from "./Stack";
import { StackElementProps } from "./StackElement";
import { useSession } from "@clerk/nextjs";
import { trpc } from "../../../utils/trpc";
import { calcAge } from "../../../utils/calcAge";

export function TenantStack() {
  const session = useSession();
  const [posts, setPosts] = useState([] as StackElementProps[]);
  const [lastPost, setLastPost] = useState<StackElementProps | null>();
  const { data, status } = trpc.post.getUsersToBeSeen.useQuery(
    { userId: session?.session?.user.id ?? "", postId: "1" },
    { enabled: posts.length <= 3 },
  );
  const { mutateAsync: dislikeHandler } =
    trpc.relationship.dislikePostForTenant.useMutation();
  const { mutateAsync: likeHandler } =
    trpc.relationship.likePostForTenant.useMutation();

  useEffect(() => {
    if (status === "success") {
      const formatedData = data.map((post) => ({
        id: post.id,
        img: post.image ?? "/sample_image.avif",
        title: post.firstName,
        age: post.birthDate ? calcAge(post.birthDate) : null,
        description: post.description,
        onReport: () => console.log("Reported"),
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
    await dislikeHandler({
      postId: post.id,
      userId: session?.session?.user.id ?? "",
    });
    removePost(post);
    setLastPost(post);
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
