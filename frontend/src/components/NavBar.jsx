import logo from "../assets/logo.svg";
import menu from "../assets/menu.svg";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaGithub } from "react-icons/fa";

const NavBar = () => {
  return (
    <motion.div
      className="relative md:fixed top-0 left-0 w-full z-20 bg-transparent"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex text-[14px] text-white avenir-font justify-between p-4">
        <div className="flex items-center space-x-8">
          <img src={menu} alt="menu" className="h-10" />
          <h1>Explore</h1>
          <h1>Store</h1>
        </div>
        <div>
          <img src={logo} alt="logo" className="h-10" />
        </div>
        <div className="flex items-center space-x-5">
          {/* <FaInstagram />
          <FaFacebook />
          <FaGithub /> */}
          <button
            className="bg-transparent  p-1 rounded-lg"
            onClick={() => {
              window.location.href = "/signup";
            }}
          >
            Sign up
          </button>
          <button
            className="bg-transparent  p-1 rounded-lg"
            onClick={() => {
              window.location.href = "/signup";
            }}
          >
            Log in
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NavBar;
