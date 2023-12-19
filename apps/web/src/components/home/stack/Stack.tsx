import { motion } from "framer-motion";
import { useState } from "react";
import { StackButton } from "./StackButton";
import { SwipeCard } from "./SwipeCard";
import { PostType } from "./PostStack";
import LikeSvg from "../../../../public/iconsButton/like.svg";
import RewindSvg from "../../../../public/iconsButton/rewind.svg";
import DislikeSvg from "../../../../public/iconsButton/dislike.svg";
import Image from "next/image";
import { PostCard } from "../../shared/post/PostCard";
import { trpc } from "../../../utils/trpc";

export type StackProps = {
  posts: PostType[];
  onLike: (post: PostType) => void;
  onDislike: (post: PostType) => void;
  onRewind: () => void;
};

export function Stack({ posts, onLike, onDislike, onRewind }: StackProps) {
  const [likeState, setLikeState] = useState<"like" | "dislike" | null>(null);

  if (!posts[0] || !posts[0].attribute) {
    return null;
  }

  return (
    <div className="flex w-full flex-grow items-center justify-center overflow-hidden py-10 px-60">
      <div className="relative flex flex-grow flex-col">
        <SwipeCard
          post={posts[0]}
          likeState={likeState}
          setLikeState={setLikeState}
          onLike={onLike}
          onDislike={onDislike}
        />

        <div className="absolute w-full">
          {posts.slice(1, 4).map((post, index) => {
            const { data: images } = trpc.image.getSignedPostUrl.useQuery({
              postId: post.id,
            });
            return (
              <div
                key={index}
                style={{ zIndex: 5 - index }}
                className="absolute w-full"
              >
                <PostCard post={post} images={images} isReduced />
              </div>
            );
          })}
        </div>
        <motion.div
          layout
          className="mt-10 flex w-full flex-grow items-center justify-center gap-20"
        >
          <StackButton
            onClick={() => setLikeState("dislike")}
            className={`hover:drop-shadow-dislike transform border-[#FF6A4F] transition-all duration-300 ease-in-out hover:scale-105 ${
              likeState == "dislike" && "drop-shadow-dislike scale-105"
            }`}
          >
            <Image
              src={DislikeSvg}
              alt="Dislike"
              width="50"
              height="50"
              className="p-1"
            />
          </StackButton>
          <StackButton
            onClick={onRewind}
            className="hover:drop-shadow-rewind flex h-fit transform border-[#F7D332] transition-all duration-300 ease-in-out hover:scale-105"
          >
            <Image src={RewindSvg} alt="Rewind" width="40" height="40" />
          </StackButton>
          <StackButton
            onClick={() => setLikeState("like")}
            className={`hover:drop-shadow-like transform border-[#63DE9A] transition-all duration-300 ease-in-out hover:scale-105 ${
              likeState == "like" && "drop-shadow-like scale-105"
            }`}
          >
            <Image src={LikeSvg} alt="Like" width="50" height="50" />
          </StackButton>
        </motion.div>
      </div>
    </div>
  );
}
