import { useState } from "react";
import { StackButton } from "./StackButton";
import { StackElement, StackElementProps } from "./StackElement";
import { SwipeCard } from "./SwipeCard";
import { CrossSvg } from "../../shared/icons/CrossSvg";
import { motion } from "framer-motion";
import Overlay from "./Overlay";
import { ReportModal } from "./ReportModal";
import { LikeSvg } from "../../shared/icons/LikeSvg";
import { RewindSvg } from "../../shared/icons/RewindSvg";

export type StackProps = {
  posts: StackElementProps[];
  onLike: (post: StackElementProps) => void;
  onDislike: (post: StackElementProps) => void;
  onRewind: () => void;
};

export function Stack({ posts, onLike, onDislike, onRewind }: StackProps) {
  const [likeState, setLikeState] = useState<"dislike" | "like" | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [reporting, setReporting] = useState(false);

  const dislikeHander = () => {
    onDislike(posts[0] as StackElementProps);
    setLikeState(null);
    setIsSelected(false);
  };
  const likeHandler = () => {
    onLike(posts[0] as StackElementProps);
    setLikeState(null);
    setIsSelected(false);
  };

  return (
    <>
      {posts.length > 0 ? (
        <>
          {isSelected && (
            <Overlay
              isSelected={isSelected}
              onClose={() => setIsSelected(false)}
            />
          )}
          <ReportModal isOpen={reporting} setIsOpen={setReporting} />
          <div className="relative">
            <div className="relative z-10">
              <SwipeCard
                onSwipeLeft={dislikeHander}
                onSwipeRight={likeHandler}
                onSwiping={(direction: "like" | "dislike" | null) => {
                  setLikeState(direction);
                }}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
                {...(posts[0] as StackElementProps)}
                onReport={() => setReporting(true)}
              />
              <motion.div
                layout
                className={
                  "relative flex justify-center " +
                  (isSelected ? "w-[90%]" : "w-full")
                }
              >
                <motion.div
                  layout
                  className={
                    "absolute z-10 mt-16 flex w-full max-w-sm justify-around " +
                    (isSelected ? "-top-36" : "")
                  }
                >
                  <StackButton onClick={dislikeHander}>
                    <motion.div
                      layout
                      className={
                        "transition-colors hover:stroke-red-600 " +
                        (likeState == "dislike"
                          ? "stroke-red-600"
                          : "stroke-red-200")
                      }
                    >
                      <CrossSvg />
                    </motion.div>
                  </StackButton>
                  <StackButton onClick={onRewind}>
                    <motion.div
                      layout
                      className="fill-blue-200 transition-colors hover:fill-blue-600"
                    >
                      <RewindSvg />
                    </motion.div>
                  </StackButton>
                  <StackButton onClick={likeHandler}>
                    <motion.div
                      layout
                      className={
                        "transition-colors hover:fill-green-600 " +
                        (likeState == "like"
                          ? "fill-green-600"
                          : "fill-green-200")
                      }
                    >
                      <LikeSvg />
                    </motion.div>
                  </StackButton>
                </motion.div>
              </motion.div>
            </div>
            {!isSelected &&
              posts.slice(1, 4).map((post, index) => (
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
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-700">No results :(</h1>

          <div className="mt-4 flex flex-col items-center justify-center">
            <p className="text-gray-500">It seems that one match your current criterias ...</p>
            <p className="text-gray-500">Try to modify them or come back later !</p>
          </div>
        </div>
      )}
    </>
  );
}
