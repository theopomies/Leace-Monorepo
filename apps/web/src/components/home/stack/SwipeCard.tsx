import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { PostCard } from "../../shared/post/PostCard";
import { PostType } from "./PostStack";

type SwipeCardProps = {
  post: PostType;
  likeState: "like" | "dislike" | null;
  setLikeState: (value: "like" | "dislike" | null) => void;
  onLike: (post: PostType) => void;
  onDislike: (post: PostType) => void;
};

export function SwipeCard({
  post,
  likeState,
  setLikeState,
  onLike,
  onDislike,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      if (likeState === "like") {
        setLikeState("like");
        animate(x, 200, {
          type: "tween",
          duration: 0.2,
          onComplete: () => {
            onLike(post);
            setLikeState(null);
          },
        });
      } else if (likeState === "dislike") {
        setLikeState("dislike");
        animate(x, -200, {
          type: "tween",
          duration: 0.2,
          onComplete: () => {
            onDislike(post);
            setLikeState(null);
          },
        });
      } else if (likeState === null) {
        animate(x, 0, { type: "tween", duration: 0 });
      }
    }
  }, [likeState, setLikeState, x, onLike, onDislike, post, isDragging]);

  return (
    <motion.div
      className="z-50 w-full"
      style={{ x, opacity, scale, rotate }}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragSnapToOrigin
      onDragStart={() => setIsDragging(true)}
      onDrag={(event, info) => {
        if (info.offset.x > 100) {
          // Swiping right
          setLikeState("like");
        } else if (info.offset.x < -100) {
          // Swiping left
          setLikeState("dislike");
        } else {
          setLikeState(null);
        }
      }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) {
          // Swiped right
          setIsDragging(false);
          setLikeState(null);
          onLike(post);
        } else if (info.offset.x < -100) {
          // Swiped left
          setIsDragging(false);
          setLikeState(null);
          onDislike(post);
        }
      }}
    >
      <PostCard key={post.id} post={post} images={post.images} isReduced />
      {!!likeState && (
        <div
          className={`absolute top-8 left-8 rounded-lg border-4 p-2 text-[5vh] font-bold ${
            likeState == "like"
              ? "border-green-600 text-green-600"
              : "border-red-600 text-red-500"
          }`}
        >
          {likeState.toLocaleUpperCase()}
        </div>
      )}
    </motion.div>
  );
}
