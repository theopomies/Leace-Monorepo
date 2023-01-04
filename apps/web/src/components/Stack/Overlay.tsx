import { motion } from "framer-motion";

type OverlayProps = {
  isSelected: boolean;
  onClose: () => void;
  onTop?: boolean;
};

export default function Overlay({
  isSelected,
  onClose,
  onTop = false,
}: OverlayProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isSelected ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: isSelected ? "auto" : "none" }}
      className={
        "absolute top-0 left-0 h-[100vh] w-[100vw] bg-black bg-opacity-80 " +
        (onTop ? "z-40" : "z-10")
      }
      onClick={onClose}
    />
  );
}
