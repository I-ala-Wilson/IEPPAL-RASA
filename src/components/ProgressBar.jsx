// Persist the previous progress so animations pick up where they left off
let globalPreviousProgress = 0;

import React, { useState, useEffect } from "react";

const ProgressBar = ({ progress, showDetails = false }) => {
  const [displayProgress, setDisplayProgress] = useState(globalPreviousProgress);

  useEffect(() => {
    // animate from the last‐seen value to the new one
    setDisplayProgress(progress);
    globalPreviousProgress = progress;
  }, [progress]);

  return (
    <div className="w-full space-y-2">
      {showDetails && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span></span>
          <span className="font-medium">{Math.round(displayProgress)} %Complete</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-pink-500 to-orange-500 h-4 rounded-full transition-all duration-500 ease-in-out shadow-sm"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;