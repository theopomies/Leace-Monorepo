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
      <div className="absolute top-0 left-0 -translate-x-1/2 ">
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
                "transition-colors hover:stroke-green-600 " +
                (likeState == "dislike"
                  ? "stroke-green-600"
                  : "stroke-green-200")
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
                "transition-colors hover:fill-red-600 " +
                (likeState == "like" ? "fill-red-600" : "fill-red-200")
              }
            >
              <LikeSvg />
            </div>
          </StackButton>
        </div>
      </div>
      {posts.slice(1, 4).map((post, index) => (
        <div
          className={`absolute top-0 left-0 -translate-x-1/2`}
          style={{
            top: `${(index + 1) * 15}px`,
            zIndex: -index - 1,
            transform: `scale(${1 - ((index + 1) * 4) / 100}) translateX(${
              -50 - (((index + 1) * 4) / 100 / 2) * 100
            }%)`,
          }}
          key={index}
        >
          <StackElement {...post} />
        </div>
      ))}
    </div>
  );
}
