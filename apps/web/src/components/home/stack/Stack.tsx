import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { CrossSvg } from "../../shared/icons/CrossSvg";
import { LikeSvg } from "../../shared/icons/LikeSvg";
import { RewindSvg } from "../../shared/icons/RewindSvg";
import { StackButton } from "./StackButton";
import { SwipeCard } from "./SwipeCard";
import { PostType } from "./PostStack";

export type StackProps = {
  posts: PostType[];
  onLike: (post: PostType) => void;
  onDislike: (post: PostType) => void;
  onRewind: () => void;
};

export function Stack({ posts, onLike, onDislike, onRewind }: StackProps) {
  const router = useRouter();

  const [likeState, setLikeState] = useState<"dislike" | "like" | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const dislikeHandler = () => {
    if (posts[0]) {
      onDislike(posts[0]);
      setLikeState(null);
      setIsSelected(false);
    }
  };

  const likeHandler = () => {
    if (posts[0]) {
      onLike(posts[0]);
      setLikeState(null);
      setIsSelected(false);
    }
  };

  if (!posts[0] || !posts[0].attribute) {
    return null;
  }

  return (
    <div className="relative my-10 flex w-full flex-grow items-center justify-center overflow-hidden">
      <div className="relative z-10 flex h-full flex-col rounded-lg bg-white shadow">
        <SwipeCard
          onSwipeLeft={dislikeHandler}
          onSwipeRight={likeHandler}
          onSwiping={(direction: "like" | "dislike" | null) => {
            setLikeState(direction);
          }}
          isSelected={isSelected}
          post={posts[0]}
          onClick={() => router.push(`/posts/${posts[0]?.id}`)}
        />
        <motion.div
          layout
          className={
            "z-10 my-5 flex w-full justify-around " +
            (isSelected ? "-top-36" : "bottom-10")
          }
        >
          <StackButton
            onClick={dislikeHandler}
            className={` border-red-200 transition-colors hover:border-red-600 hover:stroke-red-600 ${
              likeState == "dislike"
                ? "border-red-600 stroke-red-600"
                : "border-red-200 stroke-red-200"
            }`}
          >
            <CrossSvg />
          </StackButton>
          <StackButton
            onClick={onRewind}
            className="border-blue-200 fill-blue-200 transition-colors hover:border-blue-600 hover:fill-blue-600"
          >
            <RewindSvg />
          </StackButton>
          <StackButton
            onClick={likeHandler}
            className={`border-green-200 hover:border-green-600 hover:fill-green-600
          ${
            likeState == "like"
              ? "border-green-600 fill-green-600"
              : "border-green-200 fill-green-200"
          }`}
          >
            <LikeSvg />
          </StackButton>
        </motion.div>
      </div>
    </div>
  );
}
