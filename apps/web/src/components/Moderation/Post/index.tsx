import { UserCard } from "../User/UserCard";
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
      <button
        className="z-10 mb-2 rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => setViewProfile(!viewProfile)}
      >
        {viewProfile ? "View post" : "View profile"}
      </button>
      {postId && !viewProfile && (
        <PostCard postId={postId} setUserId={setUserId} />
      )}
      {viewProfile && userId && <UserCard userId={userId} />}
    </div>
  );
};
