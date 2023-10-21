import { useRouter } from "next/router";
import { Stack } from "./Stack";
import { trpc } from "../../../utils/trpc";

export interface PostStackProps {
  userId: string;
}

export function PostStack({ userId }: PostStackProps) {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data: posts } = trpc.post.getPostsToBeSeen.useQuery({ userId });

  const { mutateAsync: likeHandler } =
    trpc.relationship.likePostForTenant.useMutation({
      async onSuccess() {
        if (posts && posts.length <= 3)
          await utils.post.getPostsToBeSeen.invalidate();
      },
    });
  const { mutateAsync: dislikeHandler } =
    trpc.relationship.dislikePostForTenant.useMutation({
      async onSuccess() {
        if (posts && posts.length <= 3)
          await utils.post.getPostsToBeSeen.invalidate();
      },
    });
  const { mutateAsync: rewindHandler } =
    trpc.relationship.rewindPostForTenant.useMutation({
      async onSuccess() {
        await utils.post.getPostsToBeSeen.invalidate();
      },
    });

  const onLike = async (postId: string) => {
    await likeHandler({ postId, userId });
  };

  const onDislike = async (postId: string) => {
    await dislikeHandler({ postId, userId });
  };

  const onRewind = async () => {
    await rewindHandler({ userId });
  };

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
