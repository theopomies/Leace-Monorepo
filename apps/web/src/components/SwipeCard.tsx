import { motion, useMotionValue, useTransform } from "framer-motion";

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
        } else if (info.offset.x < -100) {
          // Swiping left
          onSwipingLeft();
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
      }}
    >
      {children}
    </motion.div>
  );
}
