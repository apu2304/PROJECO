import { motion } from "framer-motion";

const dotsVariants = {
  animate: {
    opacity: [0.3, 1, 0.3],
    transition: {
      repeat: Infinity,
      duration: 1.2,
      ease: "easeInOut",
      staggerChildren: 0.2,
    },
  },
};

const dotVariants = {
  animate: {
    scale: [1, 1.5, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        className="flex items-center justify-center gap-2"
        variants={dotsVariants}
        animate="animate"
      >
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="w-3 h-3 rounded-full bg-white"
            variants={dotVariants}
          />
        ))}
      </motion.div>
      <motion.p
        className="text-white text-sm mt-4 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 1, 0.5, 0], y: [0, -4, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
}


