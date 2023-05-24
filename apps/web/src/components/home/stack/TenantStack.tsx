import { useEffect, useState } from "react";
import { Stack } from "./Stack";
import { StackElementProps } from "./StackElement";
import { trpc } from "../../../utils/trpc";
import { calcAge } from "../../../utils/calcAge";
import { Select } from "../../shared/button/Select";
import { Loader } from "../../shared/Loader";
import { PostType } from "@prisma/client";

export function TenantStack() {
  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: posts, isLoading } = trpc.post.getPostsByUserId.useQuery({
    userId: session?.userId ?? "",
  });
  const [postId, setPostId] = useState<string>("");
  const [users, setUsers] = useState([] as StackElementProps[]);
  const [lastUser, setLastUser] = useState<StackElementProps | null>();
  const { data, status } = trpc.post.getUsersToBeSeen.useQuery(
    { postId },
    { enabled: users.length <= 3 },
  );
  const { mutateAsync: dislikeHandler } =
    trpc.relationship.dislikeTenantForPost.useMutation();
  const { mutateAsync: likeHandler } =
    trpc.relationship.likeTenantForPost.useMutation();

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
      setUsers(formatedData as StackElementProps[]);
    }
  }, [data, status]);

  const removeUser = (user: StackElementProps) => {
    setUsers((users) => {
      const newUsers = users.filter((u) => u.id !== user.id);
      return newUsers;
    });
  };

  const onLike = async (user: StackElementProps) => {
    await likeHandler({
      postId,
      userId: user.id,
    });
    removeUser(user);
    setLastUser(user);
  };

  const onDislike = async (user: StackElementProps) => {
    await dislikeHandler({
      postId,
      userId: user.id,
    });
    removeUser(user);
    setLastUser(user);
  };

  const onRewind = () => {
    if (lastUser) {
      setUsers((users) => [lastUser, ...users]);
      setLastUser(null);
    }
  };

  if (isLoading) return <Loader />;

  if (!posts)
    return (
      <div className="flex flex-grow items-center justify-center">
        <h1 className="text-2xl font-bold">
          No posts found, please create a post
        </h1>
      </div>
    );

  return (
    <div className="flex flex-grow flex-col p-8">
      <div className="flex-grow-0">
        <Select
          options={
            posts
              ?.filter((post) => post.type === PostType.TO_BE_RENTED)
              .map((post) => ({
                label: post.title ?? "title",
                value: post.id,
              })) ?? []
          }
          value={postId}
          onChange={(value) => setPostId(value)}
          placeholder="Select a post"
        />
      </div>
      <div className="flex flex-grow items-center justify-center">
        <Stack
          posts={users}
          onDislike={onDislike}
          onLike={onLike}
          onRewind={onRewind}
        />
      </div>
    </div>
  );
}
