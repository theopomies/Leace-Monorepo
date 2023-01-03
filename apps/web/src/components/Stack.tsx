import { StackElement, StackElementProps } from "./StackElement";
import { SwipeCard } from "./SwipeCard";

export type StackProps = {
  posts: StackElementProps[];
  onLike: (post: StackElementProps) => void;
  onDislike: (post: StackElementProps) => void;
};

export function Stack({ posts, onLike, onDislike }: StackProps) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 -translate-x-1/2 ">
        <SwipeCard
          onSwipeLeft={() => onDislike(posts[0] as StackElementProps)}
          onSwipeRight={() => onLike(posts[0] as StackElementProps)}
          onSwipingLeft={() => console.log("swiping left")}
          onSwipingRight={() => console.log("swiping right")}
        >
          <StackElement {...(posts[0] as StackElementProps)} />
        </SwipeCard>
      </div>
      {posts.slice(1, 4).map((post, index) => (
        <div
          className={`absolute top-0 left-0 -translate-x-1/2`}
          style={{
            top: `${(index + 1) * 15}px`,
            zIndex: -index - 1,
            transform: `scale(${1 - ((index + 1) * 4) / 100}) translateX(${
              -50 - (((index + 1) * 4) / 100 / 2) * 100
            }%)`,
          }}
          key={index}
        >
          <StackElement {...post} />
        </div>
      ))}
    </div>
  );
}
