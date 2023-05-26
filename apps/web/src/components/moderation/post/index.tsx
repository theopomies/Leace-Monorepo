//DELETE THIS FILE
import { Button } from "../../shared/button/Button";
import { UserCard } from "../user/UserCard";
import { PostCard } from "./PostCard";
import { useState } from "react";

export interface PostProps {
  postId: string;
}

export const Post = ({ postId }: PostProps) => {
  const [viewProfile, setViewProfile] = useState(false);
  const [userId, setUserId] = useState("");

  return (
    <div className="flex w-full flex-col">
      <Button onClick={() => setViewProfile(!viewProfile)} className="mb-2">
        {viewProfile ? "View post" : "View profile"}
      </Button>
      {postId && !viewProfile && <PostCard postId={postId} />}
      {viewProfile && userId && <UserCard userId={userId} />}
    </div>
  );
};
