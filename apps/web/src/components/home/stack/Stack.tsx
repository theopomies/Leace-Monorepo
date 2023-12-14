import { motion } from "framer-motion";
import { useRouter } from "next/router";
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
  const router = useRouter();

  const [likeState, setLikeState] = useState<"dislike" | "like" | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const dislikeHandler = () => {
    if (posts[0]) {
      onDislike(posts[0]);
      setLikeState(null);
      setIsSelected(false);
    }
  };

  const likeHandler = () => {
    if (posts[0]) {
      onLike(posts[0]);
      setLikeState(null);
      setIsSelected(false);
    }
  };

  if (!posts[0] || !posts[0].attribute) {
    return null;
  }

  return (
    <div className="relative flex w-full flex-grow items-center justify-center overflow-hidden py-10">
      <div className="relative z-10 flex h-full flex-col">
        <SwipeCard
          onSwipeLeft={dislikeHandler}
          onSwipeRight={likeHandler}
          onSwiping={(direction: "like" | "dislike" | null) => {
            setLikeState(direction);
          }}
          isSelected={isSelected}
          post={posts[0]}
          onClick={() => router.push(`/posts/${posts[0]?.id}`)}
        />
        <motion.div
          layout
          className={
            "z-10 mt-10 flex w-full items-center justify-center gap-20 " +
            (isSelected ? "-top-36" : "bottom-10")
          }
        >
          <StackButton
            onClick={dislikeHandler}
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
            onClick={likeHandler}
            className={`hover:drop-shadow-like transform border-[#63DE9A] transition-all duration-300 ease-in-out hover:scale-105 ${
              likeState == "like" && "drop-shadow-like scale-105"
            }`}
          >
            <Image src={LikeSvg} alt="Like" width="50" height="50" />
          </StackButton>
        </motion.div>
      </div>
      {posts.slice(1, 4).map((post, index) => {
        const { data: images } = trpc.image.getSignedPostUrl.useQuery({
          postId: post.id,
        });
        return (
          <div
            className="absolute top-0 mt-10"
            style={{
              zIndex: 5 - index,
            }}
            key={index}
          >
            <PostCard post={post} images={images} />
          </div>
        );
      })}
    </div>
  );
}
