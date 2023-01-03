import { StackElement } from "./StackElement";
import { SwipeCard } from "./SwipeCard";

export function Stack() {
  return (
    <SwipeCard
      onSwipeLeft={() => console.log("swiped left")}
      onSwipeRight={() => console.log("swiped right")}
      onSwipingLeft={() => console.log("swiping left")}
      onSwipingRight={() => console.log("swiping right")}
    >
      <StackElement
        img={"/sample_image.avif"}
        title="Théo"
        age={22}
        description="Nouvel étudiant bordelais, je cherche un appartement dans la région pour la rentrée de septembre 2023."
      />
    </SwipeCard>
  );
}
