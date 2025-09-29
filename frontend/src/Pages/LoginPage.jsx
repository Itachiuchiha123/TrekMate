import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import image_2 from "../assets/mountain_2.webp";
import sky_2 from "../assets/sky_2.webp";
import { useMediaQuery } from "react-responsive";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error } = useAuthStore();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/dashboard", { replace: true });
  };
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <>
      <div className="h-screen w-full relative">
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
          className="absolute inset-0 z-0 w-full h-full object-cover"
          alt="second image"
          initial={{ top: "10%" }}
          animate={{ top: "0%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <NavBar />
        <div className="flex justify-end z-10 h-screen w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="max-w-md w-full h-[60vh] mt-28 mr-20 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden "
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r text-white text-transparent bg-clip-text">
                Welcome Back
              </h2>

              <form onSubmit={handleLogin} className="z-20">
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex items-center mb-6">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-white hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                {error && (
                  <p className="text-red-500 font-semibold mb-2">{error}</p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r bg-black text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin  mx-auto" />
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </form>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-white hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
