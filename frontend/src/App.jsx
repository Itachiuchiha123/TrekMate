import "./App.css";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader.jsx"; // Ensure this path is correct
import { ReactLenis } from "lenis/dist/lenis-react";

const NavBar = lazy(() => import("./components/NavBar"));
const Hero = lazy(() => import("./components/hero"));
const HeroScrollDemo = lazy(() => import("./components/HeroScrollDemo"));
const Paragraph = lazy(() => import("./components/Paragraph"));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <ReactLenis
        root
        options={{
          lerp: 0.05,
        }}
      >
        <div className="relative overflow-hidden">
          <NavBar />
          <Hero />
          <HeroScrollDemo />
          <Paragraph />
        </div>
      </ReactLenis>
    </Suspense>
  );
}

export default App;
