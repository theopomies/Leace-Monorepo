import { motion } from "framer-motion";
import { XOR } from "../../utils/types";
import { SlideShow } from "./SlideShow";

export type StackElementProps = {
  id: string;
  img: string;
  title: string;
  description: string;
  isExpanded?: boolean;
  onReport: () => void;
} & XOR<{ age: number }, { price: number; region: string }>;

export function StackElement({
  img,
  title,
  description,
  price,
  age,
  region,
  isExpanded = false,
  onReport,
}: StackElementProps) {
  const splitDesc = description.split(" ");
  const splitDescLength = splitDesc.length;
  const maxSplitLength = 20;
  const tooLongDesc = splitDescLength > maxSplitLength;
  const newDesc = isExpanded
    ? description
    : splitDesc.slice(0, maxSplitLength).join(" ") + (tooLongDesc ? "..." : "");
  return (
    <motion.div
      layout
      data-isExpanded={isExpanded}
      className="relative flex w-96 flex-col items-center gap-4 rounded-md bg-white p-2 shadow-lg [&[data-isExpanded=true]]:min-h-[90vh] [&[data-isExpanded=true]]:w-[90%]"
    >
      {isExpanded && (
        <span className="absolute bottom-3 right-4">
          <button
            className="bg-red-400 px-3 py-1 text-white hover:bg-red-500"
            onClick={onReport}
          >
            Report
          </button>
        </span>
      )}
      <motion.div
        layout
        className="relative flex items-center justify-center overflow-hidden rounded-md bg-gray-100"
      >
        {isExpanded ? (
          <SlideShow images={[img, img, img]} />
        ) : (
          <img src={img} alt="" className="h-auto w-full select-none" />
        )}
      </motion.div>
      <motion.div layout className="flex w-full p-2">
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
      </motion.div>
    </motion.div>
  );
}
