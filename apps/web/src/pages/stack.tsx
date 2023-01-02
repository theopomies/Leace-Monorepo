import { StackElement } from "../components/StackElement";

export default function Stack() {
  return (
    <div className="flex w-full items-center justify-center gap-20 p-48">
      <StackElement
        img={"/sample_image.avif"}
        title="Théo"
        age={22}
        description="Nouvel étudiant bordelais, je cherche un appartement dans la région pour la rentrée de septembre 2023."
      />
      <br />
      <StackElement
        img={"/sample_image.avif"}
        title="Appartement Bordeaux Victoire"
        price={1_200}
        region="Victoire, Bordeaux"
        description="Nouvel étudiant bordelais, je cherche un appartement dans la région pour la rentrée de septembre 2023."
      />
    </div>
  );
}
