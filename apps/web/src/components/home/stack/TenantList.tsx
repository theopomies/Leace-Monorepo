/* eslint-disable @next/next/no-img-element */
import { PostType } from "@prisma/client";
import router from "next/router";
import { useEffect } from "react";
import { trpc } from "../../../utils/trpc";
import { useParameterCache } from "../../../utils/useCache";
import { Loader } from "../../shared/Loader";
import { Button } from "../../shared/button/Button";
import { Select } from "../../shared/button/Select";
import { TenantBar } from "./TenantBar";

export interface TenantListProps {
  userId: string;
}

export function TenantList({ userId }: TenantListProps) {
  const { setCacheValue, deleteCacheValue, getCacheValue } =
    useParameterCache();
  const postId = getCacheValue("postId");
  const { data: posts, isLoading: postsIsLoading } =
    trpc.post.getPostsByUserId.useQuery({
      userId,
    });
  const { data: tenants, isLoading: tenantsIsLoading } =
    trpc.post.getUsersToBeSeen.useQuery(
      { postId: postId ?? "" },
      { retry: false, enabled: !!postId },
    );

  useEffect(() => {
    if (postId) return;

    const id = posts?.[0]?.id;

    if (id) {
      setCacheValue("postId", id);
    } else if (postId && !id) {
      deleteCacheValue("postId");
    }
  }, [posts, postId, setCacheValue, deleteCacheValue]);

  if (postsIsLoading) {
    return <Loader />;
  }

  const redirectToCreatePost = () => {
    router.push(`/users/${userId}/posts/create`);
  };

  if (!posts || posts.length === 0)
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">No posts found :(</h1>
        <p className="mb-2 text-gray-500">You need to create a post first</p>
        <Button onClick={redirectToCreatePost}>Create a post</Button>
      </div>
    );

  if (tenantsIsLoading) {
    return <Loader />;
  }

  const handleSelect = (id: string) => {
    setCacheValue("postId", id);
  };

  if (!postId)
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">
          Please select a post
        </h1>
      </div>
    );

  return (
    <div className="flex w-3/4 flex-col items-center gap-y-10 p-8 pt-16">
      <div className="flex h-28 w-1/3 items-center justify-center text-center">
        <h2 className="text-2xl">Here are your potential tenants:</h2>
      </div>
      <div className="w-full">
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
          onChange={handleSelect}
          placeholder="Select a post"
        />
      </div>
      {tenants && tenants.length > 0 ? (
        <div className="w-full flex-grow flex-col">
          {tenants.map((tenant) => (
            <TenantBar key={tenant.id} postId={postId} tenant={tenant} />
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
