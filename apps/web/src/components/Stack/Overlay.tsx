import { motion } from "framer-motion";

type OverlayProps = {
  isSelected: boolean;
  onClose: () => void;
};

export default function Overlay({ isSelected, onClose }: OverlayProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isSelected ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: isSelected ? "auto" : "none" }}
      className="absolute top-0 left-0 z-10 h-[100vh] w-[100vw] bg-black bg-opacity-80"
      onClick={onClose}
    />
  );
}
