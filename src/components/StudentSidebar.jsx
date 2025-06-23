// src/components/StudentSidebar.jsx
import React, { useState } from "react";
import { ReactComponent as IeppalLogo } from "../assets/icons/ieppal-logo.svg";

export default function StudentSidebar() {
  const [extended, setExtended] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExtended(true)}
      onMouseLeave={() => setExtended(false)}
      className={`transition-all duration-300 ${extended ? "w-56" : "w-16"} bg-gradient-to-b from-pink-500 to-orange-500 h-screen shadow-lg p-4`}
    >
      {/* Header with IEPPAL logo and text aligned with menu items */}
      <div className="flex items-center mb-8">
        <IeppalLogo className="w-10 h-10" />
        {extended && (
          <span className="ml-4 text-[40px] leading-none font-semibold text-white transition-opacity duration-300 whitespace-nowrap">
            IEPPAL
          </span>
        )}
      </div>
      
      {/* Menu Options Text */}
      {extended && (
        <div className="px-3 mb-4">
          <p className="text-white/80 text-sm font-medium">
            MENU OPTIONS
          </p>
        </div>
      )}
    </aside>
  );
}