import React from "react";
import { NavLink } from "react-router-dom";

const SidebarMenu = ({
  menuItems,
  sidebarOpen,
  isRtl,
  textColor,
  secondaryText,
  hoverBg,
  accentColor,
}) => (
  <nav className="flex-1 py-4 px-2 space-y-1">
    {menuItems.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
            isActive
              ? `bg-[#2c1b0f] ${textColor} ${
                  isRtl ? "border-r-4" : "border-l-4"
                }`
              : `${secondaryText} ${hoverBg}`
          }`
        }
        style={({ isActive }) =>
          isActive
            ? isRtl
              ? { borderRightColor: accentColor }
              : { borderLeftColor: accentColor }
            : {}
        }
      >
        <item.icon className="text-lg flex-shrink-0" />
        {sidebarOpen && (
          <span className="text-sm font-medium">{item.name}</span>
        )}
      </NavLink>
    ))}
  </nav>
);

export default SidebarMenu;
