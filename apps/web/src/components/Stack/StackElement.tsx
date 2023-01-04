import { XOR } from "../../utils/types";

export type StackElementProps = {
  id: string;
  img: string;
  title: string;
  description: string;
} & XOR<{ age: number }, { price: number; region: string }>;

export function StackElement({
  img,
  title,
  description,
  price,
  age,
  region,
}: StackElementProps) {
  const splitDesc = description.split(" ");
  const splitDescLength = splitDesc.length;
  const maxSplitLength = 20;
  const tooLongDesc = splitDescLength > maxSplitLength;
  const newDesc =
    splitDesc.slice(0, maxSplitLength).join(" ") + (tooLongDesc ? "..." : "");
  return (
    <div className="flex w-96 flex-col items-center gap-4 rounded-md bg-white p-2 shadow-lg">
      <div className="relative flex items-center justify-center overflow-hidden rounded-md bg-gray-100">
        <img src={img} alt="" className="h-auto w-full select-none" />
      </div>
      <div className="flex w-full p-2">
        <div className="flex h-full w-full flex-col">
          <div className="flex justify-between">
            <span className="font-medium">
              {title}
              {!!age && ", " + age}
            </span>
            {!!price && <span className="font-bold">{price} €/mois</span>}
          </div>
          {region && <div className="font-light text-gray-500">{region}</div>}
          <div className="mt-2">{newDesc}</div>
        </div>
      </div>
    </div>
  );
}
