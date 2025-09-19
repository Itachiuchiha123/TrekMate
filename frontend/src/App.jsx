import "./App.css";
import { lazy } from "react";
import { Suspense } from "react";
import Loader from "./components/loader";
const NavBar = lazy(() => import("./components/NavBar"));
const Hero = lazy(() => import("./components/hero"));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="relative overflow-hidden">
        <NavBar />
        <Hero />

        <div className="relative h-screen w-screen bg-gradient-to-b from-[#010101] to-black"></div>
      </div>
    </Suspense>
  );
}

export default App;
