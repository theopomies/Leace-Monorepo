import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

type SwipeCardProps = {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipingLeft?: () => void;
  onSwipingRight?: () => void;
};

export function SwipeCard({
  children,
  onSwipeLeft = () => null,
  onSwipeRight = () => null,
  onSwipingLeft = () => null,
  onSwipingRight = () => null,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const [likeValue, setLikeValue] = useState<"like" | null | "dislike">();

  return (
    <motion.div
      style={{ x, opacity, scale, rotate }}
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragSnapToOrigin
      onDrag={(event, info) => {
        if (info.offset.x > 100) {
          // Swiping right
          onSwipingRight();
          setLikeValue("like");
        } else if (info.offset.x < -100) {
          // Swiping left
          onSwipingLeft();
          setLikeValue("dislike");
        } else {
          setLikeValue(null);
        }
      }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) {
          // Swiped right
          onSwipeRight();
        } else if (info.offset.x < -100) {
          // Swiped left
          onSwipeLeft();
        } else {
          setLikeValue();
        }
      }}
    >
      {children}
      {!!likeValue && (
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
