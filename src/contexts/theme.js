import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  themeMode: "light",
  darkMode: () => {},
  lightMode: () => {},
});

export const ThemeProvider = ThemeContext.Provider;

/**
 * Returns the value of the current theme from the ThemeContext.
 *
 * @return {object} The value of the current theme
 */
export default function useTheme() {
  return useContext(ThemeContext);
}
