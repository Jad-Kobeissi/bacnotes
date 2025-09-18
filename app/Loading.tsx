import { motion } from "motion/react";
export default function Loading({ className }: { className?: string }) {
  return (
    <motion.div
      className={`text-[1.5rem] font-bold ${className}`}
      animate={{ scale: [0.9, 1, 0.9] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop" }}
    >
      <h1>Loading...</h1>
    </motion.div>
  );
}
