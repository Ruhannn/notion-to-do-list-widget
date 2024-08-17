import { motion } from "framer-motion";
import { CardProps } from "../types";
import DropIndicator from "./DropIndicator";

const Card = ({ title, id, column, handleDragStart }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id ?? null} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="p-3 border rounded cursor-grab border-neutral-700 bg-neutral-800 active:cursor-grabbing">
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};
export default Card;
