import image_2 from "../assets/mountain_2.webp";
import sky_2 from "../assets/sky_2.webp";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const SignWrapper = ({ children, signup }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  return (
    <div className="h-screen w-full relative overflow-hidden">
      <motion.div
        className="absolute w-full h-screen inset-0 z-0 "
        style={{
          backgroundImage: `url(${sky_2})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        initial={{ backgroundSize: isMobile ? "200%" : "150%" }}
        animate={{ backgroundSize: isMobile ? "cover" : "100%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {" "}
      </motion.div>
      <motion.img
        src={image_2}
        style={{
          objectFit: "cover",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
        }}
        className="absolute inset-0 z-0 w-full h-full object-cover "
        alt="second image"
        initial={{ top: "10%" }}
        animate={{ top: signup ? "0%" : "20%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {children}
    </div>
  );
};

export default SignWrapper;
