import React from "react";
import "./Loader.css";
import Logo from "../ui/Logo";


const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        {/* Pickleball with bounce animation */}
        <div className="pickleball">
        <Logo />
        </div>
        {/* Monkey mascot spinning around the ball */}
      </div>
      <p className="loader-text">Finding pickleball fun...</p>
    </div>
  );
};

export default Loader;