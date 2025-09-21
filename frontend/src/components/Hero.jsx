import image from "../assets/image.png";
import mountain from "../assets/mountain.svg";
import { motion } from "framer-motion";
import React from "react";

const Hero = () => {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <motion.div
          className="top-0 left-0 flex items-center"
          style={{
            backgroundImage: `url(${image})`,
            width: "100%",
            height: "100vh",

            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
          initial={{ backgroundSize: "150%" }}
          animate={{ backgroundSize: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            className="ml-4 p-2 md:ml-10 md:p-8"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <h1 className="text-white text-xl md:text-4xl lg:text-5xl">
              Welcome to TrekMate
            </h1>
            <p className="text-white text-xs md:text-[17px] lg:text-lg avenir-font">
              Explore the world with us!
            </p>
          </motion.div>
        </motion.div>
      </div>
      <motion.img
        src={mountain}
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="absolute z-10 w-full left-0"
        alt="second image"
        initial={{ top: "10%" }}
        animate={{ top: "0%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </>
  );
};

export default Hero;
