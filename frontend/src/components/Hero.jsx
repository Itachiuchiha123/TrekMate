import image from "../assets/image.webp";
import mountain from "../assets/mountain.webp";
import { motion } from "framer-motion";
import React from "react";
import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const TextY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <>
      <div className="h-screen w-full relative" ref={ref}>
        <motion.div
          className="absolute w-full h-full inset-0 z-0 flex items-center bg-black "
          style={{
            backgroundImage: `url(${image})`,
            y: backgroundY,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          initial={{ backgroundSize: isMobile ? "200%" : "150%" }}
          animate={{ backgroundSize: isMobile ? "cover" : "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            className="ml-4 p-2 md:ml-10 md:p-8"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ y: TextY }}
          >
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl">
              Welcome to TrekMate
            </h1>
            <p className="text-white text-2xs md:text-[17px] lg:text-lg avenir-font">
              Explore the world with us!
            </p>
          </motion.div>
        </motion.div>

        <motion.img
          src={mountain}
          style={{
            objectFit: "cover",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
          }}
          className="absolute inset-0 z-10 w-full h-full object-cover"
          alt="second image"
          initial={{ top: "10%" }}
          animate={{ top: "0%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
    </>
  );
};

export default Hero;
