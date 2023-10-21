/* eslint-disable @next/next/no-img-element */
import { User } from "@leace/db";
import { PostType } from "@prisma/client";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Select } from "../../shared/button/Select";
import { getCacheData, setCacheId } from "../../../utils/useCache";
import { calcAge } from "../../../utils/calcAge";
import { Button } from "../../shared/button/Button";

export interface TenantListProps {
  userId: string;
}

export function TenantList({ userId }: TenantListProps) {
  const utils = trpc.useContext();
  const [postId, setPostId] = useState<string>(
    getCacheData("homeLastSelectedPostId") ?? "",
  );
  const { data: posts, isLoading } = trpc.post.getPostsByUserId.useQuery({
    userId,
  });
  const { data: tenants } = trpc.post.getUsersToBeSeen.useQuery({ postId });
  const { mutateAsync: dislikeHandler } =
    trpc.relationship.dislikeTenantForPost.useMutation({
      async onSuccess() {
        await utils.post.getPostsToBeSeen.invalidate();
      },
    });
  const { mutateAsync: likeHandler } =
    trpc.relationship.likeTenantForPost.useMutation({
      async onSuccess() {
        await utils.post.getPostsToBeSeen.invalidate();
      },
    });

  const redirectToCreatePost = () => {
    router.push(`/users/${userId}/posts/create`);
  };

  const onLike = async (tenant: User) => {
    await likeHandler({ postId, userId: tenant.id });
  };

  const onDislike = async (tenant: User) => {
    await dislikeHandler({ postId, userId: tenant.id });
  };

  if (isLoading) return <Loader />;

  if (!posts || posts.length === 0)
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">No posts found :(</h1>
        <p className="mb-2 text-gray-500">You need to create a post first</p>
        <button
          onClick={redirectToCreatePost}
          className="flex h-12 items-center justify-center rounded-md bg-indigo-500 p-4 font-bold text-white"
        >
          Create a post
        </button>
      </div>
    );

  return (
    <div className="flex flex-grow flex-col p-8">
      <div className="flex-grow-0">
        <Select
          options={
            posts
              .filter((post) => post.type === PostType.TO_BE_RENTED)
              .map((post) => ({
                label: post.title ?? "title",
                value: post.id,
              })) ?? []
          }
          value={postId}
          onChange={(value) => {
            setCacheId("homeLastSelectedPostId", value);
            setPostId(value);
          }}
          placeholder="Select a post"
        />
      </div>
      {postId && (
        <h2 className="mt-8 text-2xl font-bold">
          Here are your potential tenants for{" "}
          {posts.find((p) => p.id === postId)?.title}
        </h2>
      )}
      {tenants && tenants.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className={`relative h-56 cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md ${
                tenant.isPremium ? "border-4 border-yellow-300" : ""
              }`}
            >
              {tenant.isPremium && (
                <div className="absolute left-0 top-[8%] w-full translate-x-[-40%] rotate-[-45deg] bg-yellow-300 px-2 text-center font-bold text-white">
                  Premium
                </div>
              )}
              <Link href={"/users/" + tenant.id}>
                <div className="flex h-2/3 items-center justify-evenly gap-4 p-2">
                  {tenant.image && (
                    <img
                      className="h-full object-cover"
                      src={tenant.image}
                      alt="User Image"
                    />
                  )}
                  <div className="p-2">
                    <h3 className="text-2xl font-bold">{tenant.firstName}</h3>
                    <div className="flex items-center">
                      {tenant.birthDate && (
                        <p className="text-gray-500">
                          {calcAge(tenant.birthDate)} ans
                        </p>
                      )}
                      <span className="mx-2">•</span>
                      <p className="text-gray-500">{tenant.job}</p>
                    </div>
                    <p className="mt-4 text-gray-500">Click to view profile</p>
                  </div>
                </div>
              </Link>
              <div className="flex cursor-auto gap-4 bg-gray-100 p-4">
                <Button onClick={() => onLike(tenant)}>Accept</Button>
                <button
                  onClick={() => onDislike(tenant)}
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
              It seems that no one liked your post yet...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
