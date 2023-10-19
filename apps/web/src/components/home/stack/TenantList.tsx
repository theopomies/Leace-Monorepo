import { User } from "@leace/db";
import { PostType } from "@prisma/client";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Select } from "../../shared/button/Select";

export function TenantList() {
  const { data: session } = trpc.auth.getSession.useQuery();
  const { data: posts, isLoading } = trpc.post.getPostsByUserId.useQuery({
    userId: session?.userId ?? "",
  });
  const [postId, setPostId] = useState<string>("");
  const [users, setUsers] = useState([] as User[]);
  const [lastUser, setLastUser] = useState<User | null>();
  const { data, status } = trpc.post.getUsersToBeSeen.useQuery({ postId });
  const { mutateAsync: dislikeHandler } =
    trpc.relationship.dislikeTenantForPost.useMutation();
  const { mutateAsync: likeHandler } =
    trpc.relationship.likeTenantForPost.useMutation();

  const redirectToProfile = () => {
    router.push(`/users/${session?.userId}/update`);
  };

  const calcAge = (birthdate: Date): number => {
    const ageDifMs = Date.now() - birthdate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    if (status === "success") {
      setUsers(data);
    }
  }, [data, status]);

  const removeUser = (user: User) => {
    setUsers((users) => {
      const newUsers = users.filter((u) => u.id !== user.id);
      return newUsers;
    });
  };

  const onLike = async (user: User) => {
    await likeHandler({
      postId,
      userId: user.id,
    });
    removeUser(user);
    setLastUser(user);
  };

  const onDislike = async (user: User) => {
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
      <h2 className="mt-8 text-2xl font-bold">
        Here are your potential tenants for{" "}
        {posts?.find((p) => p.id === postId)?.title}
      </h2>
      {users.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`mx-auto cursor-pointer overflow-hidden rounded-xl bg-white shadow-md  ${
                user.isPremium ? "border-4 border-yellow-300" : ""
              }`}
            >
              <Link href={"/users/" + user.id}>
                <div className="flex w-max flex-col lg:flex-row">
                  {user.image && (
                    <div className="relative md:shrink-0">
                      <img
                        className="h-48 w-full object-cover md:h-full md:w-48"
                        src={user.image}
                        alt="User Image"
                      />
                      {user.isPremium && (
                        <div className="absolute left-0 top-[20%] w-full translate-x-[-25%] rotate-[-45deg] bg-yellow-300 px-2 text-center font-bold text-white">
                          Premium
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold">{user.firstName}</h3>
                    <div className="flex items-center">
                      {user.birthDate && (
                        <p className="text-gray-500">
                          {calcAge(user.birthDate)} ans
                        </p>
                      )}
                      <span className="mx-2">•</span>
                      <p className="text-gray-500">{user.country}</p>
                      <p className="mt-2 text-slate-500">{user.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex cursor-auto gap-4 bg-gray-100 p-4">
                <button
                  onClick={() => onLike(user)}
                  className="flex h-12 w-1/2 items-center justify-center rounded-md bg-indigo-500 font-bold text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => onDislike(user)}
                  className="flex h-12 w-1/2 items-center justify-center rounded-md bg-gray-300 font-bold text-black"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-grow flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-700">No results :(</h1>

          <div className="mt-4 flex flex-col items-center justify-center">
            <p className="text-gray-500">
              It seems that no one matches your current criterias ...
            </p>
            <p className="text-gray-500">
              Try to{" "}
              <a
                className="font-bold text-blue-500"
                onClick={redirectToProfile}
                href="#"
              >
                modify
              </a>{" "}
              them or come back later !
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
