import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { PostCard } from "../../shared/post/PostCard";
import { PostType } from "./PostStack";
import { trpc } from "../../../utils/trpc";

type SwipeCardProps = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwiping?: (direction: "like" | "dislike" | null) => void;
  isSelected: boolean;
  onClick?: () => void;
  post: PostType;
};

export function SwipeCard({
  onSwipeLeft = () => null,
  onSwipeRight = () => null,
  onSwiping = () => null,
  isSelected,
  onClick,
  post,
}: SwipeCardProps) {
  const { data: images } = trpc.image.getSignedPostUrl.useQuery({
    postId: post.id,
  });

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const [likeValue, setLikeValue] = useState<"like" | null | "dislike">();
  const [, setTap] = useState<boolean>(true); // Hack

  return (
    <motion.div
      className="h-full w-full overflow-hidden"
      style={{ x, opacity, scale, rotate }}
      drag={isSelected ? false : "x"}
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
          onSwipeRight();
        } else if (info.offset.x < -100) {
          // Swiped left
          onSwipeLeft();
        }
        setLikeValue(null);
        setTap(false);
      }}
      // DISGUSTING CODE SORRY BOUT THAT
      onTap={() => {
        setTap((tap) => {
          if (!tap || isSelected) {
            return true;
          }
          // Tap Logic
          onClick?.();
          return true;
        });
      }}
    >
      <PostCard post={post} images={images} />
      {!!likeValue && !isSelected && (
        <div
          className={`absolute top-8 left-8 border-2 px-1 font-bold ${
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
