import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { PostCard } from "../../shared/post/PostCard";
import { PostType } from "./PostStack";
import { trpc } from "../../../utils/trpc";

type SwipeCardProps = {
  onSwiping?: (direction: "like" | "dislike" | null) => void;
  clickOn: "like" | "dislike" | null;
  setClickOn: (value: "like" | "dislike" | null) => void;
  post: PostType;
  onLike: (post: PostType) => void;
  onDislike: (post: PostType) => void;
};

export function SwipeCard({
  onSwiping = () => null,
  clickOn,
  setClickOn,
  post,
  onLike,
  onDislike,
}: SwipeCardProps) {
  const { data: images } = trpc.image.getSignedPostUrl.useQuery({
    postId: post.id,
  });

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const [likeValue, setLikeValue] = useState<"like" | null | "dislike">();

  useEffect(() => {
    if (clickOn === "like") {
      x.set(0);
      setLikeValue("like");
      animate(x, 200, {
        type: "tween",
        duration: 0.2,
        onComplete: () => {
          onLike(post);
          setClickOn(null);
        },
      });
    } else if (clickOn === "dislike") {
      x.set(0);
      setLikeValue("dislike");
      animate(x, -200, {
        type: "tween",
        duration: 0.2,
        onComplete: () => {
          onDislike(post);
          setClickOn(null);
        },
      });
    } else {
      x.set(0);
      setLikeValue(null);
    }
    x.set(0);
  }, [clickOn, setClickOn, x, onLike, onDislike, post, images]);

  return (
    <motion.div
      className="z-50 w-full"
      style={{ x, opacity, scale, rotate }}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragSnapToOrigin
      onDrag={(event, info) => {
        if (info.offset.x > 100) {
          // Swiping right
          onSwiping("like");
          setLikeValue("like");
        } else if (info.offset.x < -100) {
          // Swiping left
          onSwiping("dislike");
          setLikeValue("dislike");
        } else {
          setLikeValue(null);
          onSwiping(null);
        }
      }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) {
          // Swiped right
          animate(x, 0, {
            type: "tween",
            duration: 0,
          });
          onSwiping(null);
          onLike(post);
        } else if (info.offset.x < -100) {
          // Swiped left
          animate(x, 0, {
            type: "tween",
            duration: 0,
          });
          onSwiping(null);
          onDislike(post);
        }
      }}
    >
      <PostCard key={post.id} post={post} images={images} isReduced />
      {!!likeValue && (
        <div
          className={`absolute top-8 left-8 rounded-lg border-4 p-2 text-[5vh] font-bold ${
            likeValue == "like"
              ? "border-green-600 text-green-600"
              : "border-red-600 text-red-500"
          }`}
        >
          {likeValue.toLocaleUpperCase()}
        </div>
      )}
    </motion.div>
  );
}
