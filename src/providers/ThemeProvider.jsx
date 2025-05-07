import React, { createContext, useContext, useEffect, useState } from "react";

// Create theme context
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
});

// Theme provider component
export function ThemeProvider({ children, defaultTheme = "light", storageKey = "vite-ui-theme" }) {
  // State to manage the current theme
  const [theme, setTheme] = useState(() => {
    // Check if a theme is stored in localStorage
    const storedTheme = localStorage.getItem(storageKey);
    // Check if there's a preferred color scheme set by the OS
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Return the stored theme, or the preferred scheme, or the default theme
    return storedTheme || (prefersDark ? "dark" : defaultTheme);
  });

  // Update the document when the theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the previous theme class and add the new one
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Save the theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Memoized value of the theme context
  const value = {
    theme,
    setTheme: (newTheme) => setTheme(newTheme),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to access the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}; 