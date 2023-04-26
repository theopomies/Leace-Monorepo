import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const SlideShow = ({ images }: { images: string[] }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([
      Math.min(Math.max(page + newDirection, 0), images.length - 1),
      newDirection,
    ]);
  };

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={images[page]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>
      {page < images.length - 1 && (
        <div
          className="top-[calc(50% - 20px)] pointer absolute right-2 z-10 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white text-lg font-bold"
          onClick={() => paginate(1)}
        >
          {"‣"}
        </div>
      )}
      {page > 0 && (
        <div
          className="top-[calc(50% - 20px)] pointer absolute left-2 z-10 flex h-[40px] w-[40px] rotate-180 items-center justify-center rounded-full bg-white text-lg font-bold"
          onClick={() => paginate(-1)}
        >
          {"‣"}
        </div>
      )}
    </>
  );
};
