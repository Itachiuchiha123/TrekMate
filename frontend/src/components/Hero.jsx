import image from "../assets/image.png";
import mountain from "../assets/mountain.svg";
import { motion } from "framer-motion";
import React from "react";

const Hero = () => {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <motion.div
          className=" fixed top-0 left-0  h-full w-full flex items-center"
          style={{
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ backgroundSize: "150%" }}
          animate={{ backgroundSize: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            className="ml-10 p-4 md:p-8"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <h1 className="text-white text-2xl md:text-4xl">
              Welcome to TrekMate
            </h1>
            <p className="text-white text-sm md:text-[17px] avenir-font">
              Explore the world with us!
            </p>
          </motion.div>
        </motion.div>
      </div>
      <motion.img
        src={mountain}
        className="absolute z-10 w-screen left-0"
        alt="second image"
        initial={{ top: "10%" }}
        animate={{ top: "0%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </>
  );
};

export default Hero;
