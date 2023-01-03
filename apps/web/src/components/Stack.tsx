import { ReactNode } from "react";
import { StackElement } from "./StackElement";
import { SwipeCard } from "./SwipeCard";

const elements: ReactNode[] = [];

for (let i = 0; i < 15; i++) {
  elements.push(
    <StackElement
      img={"/sample_image.avif"}
      title="Théo"
      age={22}
      description="Nouvel étudiant bordelais, je cherche un appartement dans la région pour la rentrée de septembre 2023."
    />,
  );
}

export function Stack() {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 -translate-x-1/2 ">
        <SwipeCard
          onSwipeLeft={() => console.log("swiped left")}
          onSwipeRight={() => console.log("swiped right")}
          onSwipingLeft={() => console.log("swiping left")}
          onSwipingRight={() => console.log("swiping right")}
        >
          {elements[0]}
        </SwipeCard>
      </div>
      {elements.slice(1, 4).map((element, index) => (
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
          {element}
        </div>
      ))}
    </div>
  );
}
