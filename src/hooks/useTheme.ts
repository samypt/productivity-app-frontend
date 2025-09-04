import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (t: Theme) => {
      if (t === "system") {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.setAttribute("data-theme", systemDark ? "dark" : "light");
      } else {
        root.setAttribute("data-theme", t);
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
