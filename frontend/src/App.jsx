import "./App.css";
import { lazy } from "react";
import { Suspense } from "react";
import { motion } from "framer-motion";
import mountain from "./assets/mountain.svg";

const NavBar = lazy(() => import("./components/NavBar"));
const Hero = lazy(() => import("./components/hero"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative overflow-hidden">
        <NavBar />
        <Hero />

        <div className="relative h-screen w-screen bg-gradient-to-b from-[#010101] to-black"></div>
      </div>
    </Suspense>
  );
}

export default App;
