import logo from "../assets/logo.svg";
import menu from "../assets/menu.svg";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaInstagram, FaFacebook, FaGithub } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import { useSelector } from "react-redux";
import { UserCircleIcon } from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(isAuthenticated);
  console.log(user);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-20 bg-transparent"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between p-4 text-white avenir-font">
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <img src={menu} alt="menu" className="h-10" />
          </button>
        </div>
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex space-x-8">
            <h1>Explore</h1>
            <h1>Store</h1>
          </div>
        </div>
        <div className="flex justify-center w-full md:w-auto">
          <a href="/landingpage">
            <img src={logo} alt="logo" className="h-10" />
          </a>
        </div>

        <div className="hidden md:flex items-center space-x-5 ">
          {/* <FaInstagram />
          <FaFacebook />
          <FaGithub /> */}
          {isAuthenticated && user?.isVerfied ? (
            <button
              className="bg-transparent p-1 rounded-lg"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              DashBoard
              <UserCircleIcon className="inline-block ml-2 h-5 w-5" />
            </button>
          ) : (
            <>
              <button
                className="bg-transparent p-1 rounded-lg"
                onClick={() => {
                  window.location.href = "/signup";
                }}
              >
                Sign up
              </button>
              <button
                className="bg-transparent p-1 rounded-lg"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-black text-white p-4">
          <div className="flex flex-col space-y-4 items-center">
            <button>
              <h1>Explore</h1>
            </button>

            <button>
              <h1>Store</h1>
            </button>
            {/* <FaInstagram />
            <FaFacebook />
            <FaGithub /> */}
            {isAuthenticated && user?.isVerfied ? (
              <button
                className="bg-transparent p-1 rounded-lg"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                DashBoard
              </button>
            ) : (
              <>
                <button
                  className="bg-transparent p-1 rounded-lg"
                  onClick={() => {
                    window.location.href = "/signup";
                  }}
                >
                  Sign up
                </button>
                <button
                  className="bg-transparent p-1 rounded-lg"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NavBar;
