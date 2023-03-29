import { Roles } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { PostCard } from "../post/PostCard";
import { PostList } from "../post/PostList";
import { UserCard } from "./UserCard";

export interface PostProps {
  userId: string;
}

export const User = ({ userId }: PostProps) => {
  const { data: user } = trpc.moderation.getUser.useQuery({ userId: userId }); // Just to get the user role

  const [viewProfile, setViewProfile] = useState(true);
  const [postId, setPostId] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col">
      {user && (user.role === Roles.AGENCY || user.role === Roles.OWNER) && (
        <button
          className="z-10 mb-2 rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={() => setViewProfile(!viewProfile)}
        >
          {viewProfile ? "View post" : "View profile"}
        </button>
      )}
      {viewProfile && userId && <UserCard userId={userId} />}
      {userId && !viewProfile && (
        <PostList userId={userId} setPostId={setPostId} />
      )}
      {postId && !viewProfile && <PostCard postId={postId} />}
    </div>
  );
};
