"use client";

import { Sun, Moon } from "lucide-react";
import "../../styles/SwitchThemeStyle.css";

const SwitchUI = ({ isChecked, handleToggle }) => (
  <>
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={handleToggle} />
      <span className="slider">
        <Sun className="background-icon sun-bg" size={16} />
        <Moon className="background-icon moon-bg" size={16} />
        <span className="slider-circle">
          {isChecked ? (
            <Moon className="active-icon" size={16} color="#FFD700" />
          ) : (
            <Sun className="active-icon" size={16} color="#FFD700" />
          )}
        </span>
      </span>
    </label>
  </>
);

export default SwitchUI;
