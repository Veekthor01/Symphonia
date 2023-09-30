import React from "react";
import "./Loading.css";

const LoadingScreen = () => {
  return (
    <div className="LoadingScreen">
      <div className="LoadingSpinner"></div>
      <p>Saving your playlist...</p>
    </div>
  );
};

export default LoadingScreen;
