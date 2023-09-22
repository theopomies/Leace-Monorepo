import { Post, PostType, User } from "@prisma/client";
import React, { useState, useEffect, useCallback } from "react";
import { trpc } from "../../utils/trpc";
import { Header } from "../shared/Header";
import { PostBar } from "../shared/post/PostBar";

interface DashboardProps {
  userId: string;
}

export const Dashboard = ({ userId }: DashboardProps) => {
  const [posts, setPosts] = useState<{ post: Post; user: User | undefined }[]>(
    [],
  );
  const [filter, setFilter] = useState<PostType | "" | null>("");
  const [filteredCount, setFilteredCount] = useState<number>(0);

  const { data: relationshipData } =
    trpc.relationship.getClientsByUserId.useQuery({ userId });

  useEffect(() => {
    if (relationshipData) {
      setPosts(
        relationshipData.map((data) => {
          return { post: data.post, user: data?.user };
        }),
      );
    }
  }, [relationshipData]);

  const sortPosts = useCallback(
    (data: { post: Post; user: User | undefined }[]) => {
      if (filter === null || filter === "") {
        return data;
      } else {
        return posts.filter((d) => d.post.type === filter);
      }
    },
    [filter, posts],
  );

  useEffect(() => {
    const filteredPosts = sortPosts(posts);
    setFilteredCount(filteredPosts.length);
  }, [filter, posts, sortPosts]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value as PostType | "";
    setFilter(selectedFilter);
  };

  const sortedPosts = sortPosts(posts);
  const { data: stats } = trpc.post.RentDataAgencyByUserId.useQuery({
    userId: userId,
  });

  return (
    <div className="container m-4 mx-auto flex flex-col">
      <Header heading="Dashboard" />

      <div className="container mx-auto mt-28 flex flex-col p-4">
        <div className="m-5 flex items-center justify-center">
          <div className="m-1 flex h-32 w-32 items-center justify-center rounded-full bg-indigo-600 p-2 text-xl font-bold text-indigo-100">
            <div className="text-center">
              <p>Expense</p>
              <p className="mt-1">{stats?.expense + " $" ?? " 0 $"}</p>
            </div>
          </div>

          <div className="m-1 flex h-32 w-32 items-center justify-center rounded-full bg-green-600 p-2 text-xl font-bold text-indigo-100">
            <div className="text-center">
              <p>Income</p>
              <p className="mt-1">{stats?.income + " $" ?? "0 $"}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-40">
          <div className="mr-2">Total Count: {posts.length}</div>
          <div className="mr-2">Filtered Count: {filteredCount}</div>
          <div className="">
            <select
              id="filter"
              value={filter || ""}
              onChange={handleFilterChange}
            >
              <option value={PostType.RENTED}>Rented</option>
              <option value={PostType.TO_BE_RENTED}>To be rented</option>
              <option value="">all</option>
            </select>
          </div>
        </div>
        <ul>
          {sortedPosts.map((d) => (
            <PostBar
              key={d.post.id}
              post={d.post}
              postLink="/posts/[postId]"
              user={d.user}
              userLink="/users/[userId]"
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
