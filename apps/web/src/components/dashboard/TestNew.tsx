import { Post, PostType } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import { Header } from "../../components/users/Header";

interface DashboardListProps {
  userId: string;
}

interface MyPostsTableProps {
  posts: Post[];
}

export const MyPostsTable: React.FC<MyPostsTableProps> = ({ posts }) => {
  return (
    <div className="flex items-center justify-center">
      <table className="w-full table-auto border-collapse border border-green-800 md:w-1/2">
        <thead>
          <tr>
            <th className="border border-green-600 px-4 py-2 text-green-800">
              Title
            </th>
            <th className="border border-green-600 px-4 py-2 text-green-800">
              Description
            </th>
            <th className="border border-green-600 px-4 py-2 text-green-800">
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="border border-green-600 px-4 py-2">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </td>
              <td className="border border-green-600 px-4 py-2">
                <Link href={`/posts/${post.id}`}>{post.desc}</Link>
              </td>
              <td className="border border-green-600 px-4 py-2">
                <Link href={`/posts/${post.id}`}>
                  {post.type === PostType.RENTED ? "Rented" : "To be rented"}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TestNew = ({ userId }: DashboardListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<PostType | "" | null>("");
  const [filteredCount, setFilteredCount] = useState<number>(0);

  const { data: postsData } = trpc.post.getPostsByUserId.useQuery({ userId });

  useEffect(() => {
    if (postsData) {
      setPosts(postsData);
    }
  }, [postsData]);

  useEffect(() => {
    const filteredPosts = sortPosts(posts);
    setFilteredCount(filteredPosts.length);
  }, [filter, posts]);

  const sortPosts = (posts: Post[]) => {
    if (filter === null || filter === "") {
      return posts;
    } else {
      return posts.filter((post) => post.type === filter);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value as PostType | "";
    setFilter(selectedFilter);
  };

  const sortedPosts = sortPosts(posts);
  const expenses_get = trpc.post.getRentExpenseByUserId.useQuery({
    userId: userId,
  });
  const incomesList = trpc.post.getRentIncomeByUserId.useQuery({
    userId: userId,
  });

  return (
    <div className="container m-4 mx-auto flex flex-col">
      <Header heading="Dashboard" />
      <div className="container mx-auto mt-28 flex flex-col p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-400">Expenses: </h2>
          <p>
            <b>{expenses_get.data ?? " 0 $"}</b>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-400">Income: </h2>
          <p>
            <b>{incomesList.data + " $" ?? " 0 $"}</b>
          </p>
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
              <option value={PostType.RENTED}>RENTED</option>
              <option value={PostType.TO_BE_RENTED}>TO BE RENTED</option>
              <option value="">all</option>
            </select>
          </div>
        </div>
        <ul>
          <MyPostsTable posts={sortedPosts} />
        </ul>
      </div>
    </div>
  );
};
