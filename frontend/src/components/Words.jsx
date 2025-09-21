import { useRef } from "react";
import { useScroll, motion } from "framer-motion";

const Words = () => {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ["0.1 0.9", "start start"],
  });

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
      style={{ opacity: scrollYProgress }}
    >
      <h1 className="text-4xl font-bold">Welcome to the world of</h1>
      <h2 className="text-6xl font-bold">Trekkers</h2>

      <p className="text-xl mt-4">FIND YOUR NEXT ADVENTURE</p>
    </motion.div>
  );
};

export default Words;
