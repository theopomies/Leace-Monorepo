// DELETE THIS FILE
import { Role } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { PostCard } from "../post/PostCard";
import { PostList } from "../post/PostList";
import { UserCard } from "./UserCard";
import { Button } from "../../shared/button/Button";

export interface PostProps {
  userId: string;
}

export const User = ({ userId }: PostProps) => {
  const { data: user } = trpc.moderation.user.getUser.useQuery({ userId });

  const [viewProfile, setViewProfile] = useState(true);
  const [postId, setPostId] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col">
      {user && (user.role === Role.AGENCY || user.role === Role.OWNER) && (
        <Button onClick={() => setViewProfile(!viewProfile)} className="mb-2">
          {viewProfile ? "View post" : "View profile"}
        </Button>
      )}
      {viewProfile && userId && <UserCard userId={userId} />}
      {userId && !viewProfile && <PostList userId={userId} />}
      {postId && !viewProfile && <PostCard postId={postId} />}
    </div>
  );
};
