import { useState } from "react";
import { LikeSvg } from "./LikeSvg";
import { StackButton } from "./StackButton";
import { StackElement, StackElementProps } from "./StackElement";
import { SwipeCard } from "./SwipeCard";
import { CrossSvg } from "./CrossSvg";
import { RewindSvg } from "./RewindSvg";

export type StackProps = {
  posts: StackElementProps[];
  onLike: (post: StackElementProps) => void;
  onDislike: (post: StackElementProps) => void;
  onRewind: () => void;
};

export function Stack({ posts, onLike, onDislike, onRewind }: StackProps) {
  const [likeState, setLikeState] = useState<"dislike" | "like" | null>(null);

  const dislikeHander = () => {
    onDislike(posts[0] as StackElementProps);
    setLikeState(null);
  };
  const likeHandler = () => {
    onLike(posts[0] as StackElementProps);
    setLikeState(null);
  };

  return (
    <div className="relative">
      <div className="relative z-10">
        <SwipeCard
          onSwipeLeft={dislikeHander}
          onSwipeRight={likeHandler}
          onSwiping={(direction: "like" | "dislike" | null) => {
            setLikeState(direction);
          }}
        >
          <StackElement {...(posts[0] as StackElementProps)} />
        </SwipeCard>
        <div className="mt-16 flex justify-around">
          <StackButton onClick={dislikeHander}>
            <div
              className={
                "transition-colors hover:stroke-red-600 " +
                (likeState == "dislike" ? "stroke-red-600" : "stroke-red-200")
              }
            >
              <CrossSvg />
            </div>
          </StackButton>
          <StackButton onClick={onRewind}>
            <div className="fill-blue-200 transition-colors hover:fill-blue-600">
              <RewindSvg />
            </div>
          </StackButton>
          <StackButton onClick={likeHandler}>
            <div
              className={
                "transition-colors hover:fill-green-600 " +
                (likeState == "like" ? "fill-green-600" : "fill-green-200")
              }
            >
              <LikeSvg />
            </div>
          </StackButton>
        </div>
      </div>
      {posts.slice(1, 4).map((post, index) => (
        <div
          className="absolute"
          style={{
            top: `${(index + 1) * 15}px`,
            zIndex: 5 - index,
            transform: `scale(${1 - ((index + 1) * 4) / 100})`,
          }}
          key={index}
        >
          <StackElement {...post} />
        </div>
      ))}
    </div>
  );
}
