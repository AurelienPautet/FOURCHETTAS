import { useEffect, useRef } from "react";

function ThemeController() {
  const themeControllerRef = useRef<HTMLInputElement>(null);
  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const theme_change = true;
    document.documentElement.setAttribute(
      "theme_change",
      theme_change.toString()
    );
    const theme = event.target.checked ? "dim" : "retro"; // Replace "light" with your default theme
    document.documentElement.setAttribute("data-theme", theme);
  };

  useEffect(() => {
    // Set initial theme based on system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = prefersDark ? "dim" : "retro"; // Replace "light" with your default theme
    document.documentElement.setAttribute("data-theme", initialTheme);
    if (prefersDark) {
      themeControllerRef.current!.checked = true;
    }
  }, []);

  return (
    <>
      <input
        ref={themeControllerRef}
        type="checkbox"
        value="dim"
        className="toggle theme-controller"
        onChange={handleThemeChange}
      />
    </>
  );
}

export default ThemeController;
