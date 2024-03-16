import React from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

/**
 * Generate a dark mode toggle component.
 *
 * @param {function} switchTheme - The function to toggle the theme
 * @param {string} theme - The current theme ('dark' or 'light')
 * @return {JSX.Element} The dark mode toggle component
 */
export default function DarkMode({ switchTheme, theme }) {
  return (
    <label className="toggle-container">
      <div className={`toggle ${theme === "dark" ? "enabled" : "disabled"}`}>
        <div className="toggle-icon">
          <LightModeIcon fontSize="small" />
          <DarkModeIcon fontSize="small" />
        </div>
        <input
          id="toggle"
          name="toggle"
          type="checkbox"
          onChange={switchTheme}
          checked={theme}
        />
      </div>
    </label>
  );
}
