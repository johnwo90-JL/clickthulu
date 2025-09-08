import React from "react";
import "../styles/background.css";
import { base_url } from "../../config";

function BackgroundPage() {
  // Lager 150 regndråper med tilfeldig posisjon og delay
  const raindrops = Array.from({ length: 350 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 1.2;
    return (
      <div
        key={i}
        className="raindrop"
        style={{ left: `${left}vw`, animationDelay: `${delay}s` }}
      />
    );
  });

  return (
    <div className="background-full">
      <div className="rain">
        {raindrops}
      </div>
    </div>
  );
}

export default BackgroundPage;