// src/components/HeroBanner/HeroBanner.jsx
import React from "react";
import "./HeroBanner.css";

const HeroBanner = ({ title }) => {
  return (
    <div className="hero-banner">
      <h1>{title}</h1>
    </div>
  );
};

export default HeroBanner;
