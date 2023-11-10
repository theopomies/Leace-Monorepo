/* eslint-disable @next/next/no-img-element */
import { PostType } from "@prisma/client";
import router from "next/router";
import { useMemo, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../../shared/Loader";
import { Select } from "../../shared/button/Select";
import { getCacheData, setCacheId } from "../../../utils/useCache";
import { TenantBar } from "./TenantBar";
import { Button } from "../../shared/button/Button";

export interface TenantListProps {
  userId: string;
}

export function TenantList({ userId }: TenantListProps) {
  const [postId, setPostId] = useState<string>(
    getCacheData("homeLastSelectedPostId") ?? "",
  );
  const { data: posts, isLoading: postsIsLoading } =
    trpc.post.getPostsByUserId.useQuery({
      userId,
    });
  const { data: tenants, isLoading: tenantsIsLoading } =
    trpc.post.getUsersToBeSeen.useQuery({ postId }, { retry: false });

  const isLoading = useMemo(() => {
    return postsIsLoading || tenantsIsLoading;
  }, [postsIsLoading, tenantsIsLoading]);

  if (isLoading) {
    return <Loader />;
  }

  const redirectToCreatePost = () => {
    router.push(`/users/${userId}/posts/create`);
  };

  const handleSelect = (id: string) => {
    setCacheId("homeLastSelectedPostId", id);
    setPostId(id);
  };

  if (!posts || posts.length === 0)
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">No posts found :(</h1>
        <p className="mb-2 text-gray-500">You need to create a post first</p>
        <Button onClick={redirectToCreatePost}>Create a post</Button>
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
          onChange={handleSelect}
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
