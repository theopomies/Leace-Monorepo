export interface RoadmapPortionProps {
  date: string;
  content: string;
  title: string;
  state: "planned" | "in-progress" | "completed";
}

export function RoadmapPortion({
  date,
  content,
  state,
  title,
}: RoadmapPortionProps) {
  const stateColor = {
    planned: "bg-gray-400",
    "in-progress": "bg-indigo-400",
    completed: "bg-green-400",
  };
  return (
    <div className="mb-8 flex w-full items-center justify-center">
      <div className="order-1 flex w-5/12">
        <h3 className="mx-auto text-lg font-semibold">{date}</h3>
      </div>
      <div
        className={`z-20 order-1 flex h-6 w-6 items-center rounded-full shadow-xl ${stateColor[state]}`}
      ></div>
      <div className="order-1 w-5/12 rounded-lg px-6 py-4">
        <h3 className="mb-3 text-xl ">{title}</h3>
        <p className="mb-3">{content}</p>
      </div>
    </div>
  );
}
