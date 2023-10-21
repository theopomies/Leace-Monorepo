import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { CrossSvg } from "../../shared/icons/CrossSvg";
import { LikeSvg } from "../../shared/icons/LikeSvg";
import { RewindSvg } from "../../shared/icons/RewindSvg";
import { ReportModal } from "./ReportModal";
import { StackButton } from "./StackButton";
import { StackElementProps } from "./StackElement";
import { SwipeCard } from "./SwipeCard";
import { Post, Attribute, Image } from "@prisma/client";

export type StackProps = {
  posts: (Post & { attribute: Attribute | null; images: Image[] })[];
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onRewind: () => void;
};

export function Stack({ posts, onLike, onDislike, onRewind }: StackProps) {
  const router = useRouter();

  const [likeState, setLikeState] = useState<"dislike" | "like" | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [reporting, setReporting] = useState(false);

  const dislikeHander = () => {
    if (posts[0]) {
      onDislike(posts[0].id);
      setLikeState(null);
      setIsSelected(false);
    }
  };

  const likeHandler = () => {
    if (posts[0]) {
      onLike(posts[0].id);
      setLikeState(null);
      setIsSelected(false);
    }
  };

  if (!posts[0] || !posts[0].attribute) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-center">
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
            {...({
              id: posts[0].id,
              img: "/appart.jpg",
              title: posts[0].title,
              description: posts[0].desc,
              isExpanded: isSelected,
              onReport: () => console.log("Reported"),
              price: posts[0].attribute.price,
              region: posts[0].attribute.location,
            } as StackElementProps)}
            onReport={() => setReporting(true)}
            onClick={() => router.push(`/posts/${posts[0]?.id}`)}
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
              <StackButton onClick={() => dislikeHander()}>
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
                    (likeState == "like" ? "fill-green-600" : "fill-green-200")
                  }
                >
                  <LikeSvg />
                </motion.div>
              </StackButton>
            </motion.div>
          </motion.div>
        </div>
        {/* vision des posts suivants c'est stylé ? */}
        {/* {posts.slice(1, 4).map((post, index) => (
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
        ))} */}
      </div>
    </div>
  );
}
