import React, { useState } from "react";
import "../styles/gameUI/xpbar.css";

function XPBar({ currentExp, maxExp }) {
  const progress = (currentExp / maxExp) * 100;
  return (
    <div className="xpbar-container">
      <div className="xpbar-fill" style={{ width: `${progress}%` }} />
      <span className="xpbar-text">
        {currentExp} / {maxExp} XP
      </span>
    </div>
  );
}

function XPBarTest() {
  const [exp, setExp] = useState(60);
  const maxExp = 100;

  const handleClick = () => {
    if (exp + 1 >= maxExp) {
      setExp(0); // reset bar
    } else {
      setExp(exp + 1);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ color: "#000000" }}>XPBar Test</h2>
      <XPBar currentExp={exp} maxExp={maxExp} />
      <button
        style={{
          marginTop: "32px",
          padding: "12px 32px",
          fontSize: "1.1rem",
          borderRadius: "8px",
          background: "#366637",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        Click to fill up ye bar
      </button>
    </div>
  );
}

export default XPBarTest;
