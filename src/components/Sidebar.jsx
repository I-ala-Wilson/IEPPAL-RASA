// sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiMessageCircle,
} from "react-icons/fi";
import { ReactComponent as IeppalLogo } from "../assets/icons/ieppal-logo.svg";

const menuItems = [
  { name: "Home", icon: <FiHome className="w-6 h-6" />, path: "/" },
  { name: "Classrooms", icon: <FiUsers className="w-6 h-6" />, path: "/classrooms" },
  { name: "Data Dashboard", icon: <FiBarChart2 className="w-6 h-6" />, path: "/iep-report" },
  { name: "Strategy Library", icon: <FiBookOpen className="w-6 h-6" />, path: "/strategy-library" },
  { name: "Calendar", icon: <FiCalendar className="w-6 h-6" />, path: "/calendar" },
];

export default function Sidebar() {
  const [extended, setExtended] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExtended(true)}
      onMouseLeave={() => setExtended(false)}
      className={`transition-all duration-300 ${extended ? "w-56" : "w-16"} bg-gradient-to-b from-pink-500 to-orange-500 h-screen shadow-lg p-4 relative`}
    >
      {/* Header with centered logo+text group */}
      <div className="relative mb-8 h-10">
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center transition-all duration-300"
        >
          <IeppalLogo className="w-10 h-10 flex-shrink-0" />
          {extended && (
            <span className="ml-4 text-[40px] leading-none font-semibold text-white transition-opacity duration-300 opacity-100 whitespace-nowrap">
              IEPPAL
            </span>
          )}
        </div>
      </div>

      <nav className="space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => {
              const base = `flex items-center h-12 rounded-lg transition-colors ${
                extended ? "px-3 justify-start" : "justify-center"
              }`;
              const active = isActive ? "bg-white/30" : "hover:bg-white/20";
              return `${base} ${active}`;
            }}
          >
            {() => (
              <>
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-white">
                  {item.icon}
                </div>
                {extended && (
                  <span className="ml-4 text-base text-white transition-opacity duration-300 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
