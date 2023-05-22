import { trpc } from "../../../utils/trpc";
import { Header } from "../Header";
import { MyPostBar } from "./MyPostBar";
import { PostType } from "@prisma/client";

export interface UserPostsListProps {
  userId: string;
}

export function UserPostsList({ userId }: UserPostsListProps) {
  const { data: posts } = trpc.post.getPostsByUserId.useQuery({ userId });

  return (
    <div className="w-full">
      <Header heading={"Post"} />
      {posts &&
        posts.map((post) => (
          <MyPostBar
            key={post.id}
            postId={post.id}
            title={post.title ?? "Title"}
            desc={post.desc ?? "Description"}
            type={post.type ?? PostType.TO_BE_RENTED}
          />
        ))}
    </div>
  );
}
