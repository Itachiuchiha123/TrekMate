import React from "react";
import { ContainerScroll } from "./ui/ContainerScroll";
import trek from "../assets/trekking.webp";

const HeroScrollDemo = () => {
  return (
    <div className=" relative flex flex-col overflow-hidden bg-gradient-to-b from-[#010101] to-black">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Welcome to the world of
              <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Trekkers
              </span>
            </h1>
          </>
        }
      >
        <img
          src={trek}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
        />
      </ContainerScroll>
    </div>
  );
};

export default HeroScrollDemo;
