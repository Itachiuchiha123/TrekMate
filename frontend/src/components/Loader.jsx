import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

const Loader = ({ message = "Booting Backend System. . ." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black",
      }}
    >
      <Quantum size="120" speed="1" color="white" />
      <span style={{ marginTop: 24, fontSize: 20, color: "white" }}>
        {message}
      </span>
    </div>
  );
};

export default Loader;
