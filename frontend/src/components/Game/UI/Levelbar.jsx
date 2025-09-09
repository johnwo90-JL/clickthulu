import React from "react";

const LevelBar = ({ currentExp, maxExp }) => {
  const progress = (currentExp / maxExp) * 100;

  return (
    <div className="w-full bg-gray-300 rounded-2xl overflow-hidden shadow-md">
      <div
        className="bg-green-500 h-6 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LevelBar;
