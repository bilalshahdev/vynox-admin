"use client";

import { useTheme } from "next-themes";
import { IoMdMoon, IoMdSunny } from "react-icons/io";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      type="button"
      className="cursor-pointer flex items-center text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      onClick={toggleTheme}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          toggleTheme();
        }
      }}
      aria-label="Toggle theme"
    >
      <IoMdSunny className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <IoMdMoon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
