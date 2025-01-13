import React, { useEffect } from "react";
import './PreLoader.css'
import { preLoaderAnim } from "@/Animations";

const PreLoader = () => {
  useEffect(() => {
    preLoaderAnim();
  }, []);
  return (
    <div className="preloader">
      <div className="texts-container">
        <span>Creating,</span>
        <span>Connecting,</span>
        <span>Celebrating.</span>
      </div>
    </div>
  );
};

export default PreLoader;