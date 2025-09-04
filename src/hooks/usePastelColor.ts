import { useEffect, useState } from "react";

export function usePastelColor(name: string) {
  const [color, setColor] = useState("");

  useEffect(() => {
    const pastelVarNames = [
      "--pastel-1",
      "--pastel-2",
      "--pastel-3",
      "--pastel-4",
      "--pastel-5",
      "--pastel-6",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % pastelVarNames.length;
    const varName = pastelVarNames[index];

    const updateColor = () => {
      const root = document.documentElement;
      const resolved = getComputedStyle(root).getPropertyValue(varName).trim();
      setColor(resolved);
    };

    updateColor(); // Initial

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          updateColor();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, [name]);

  return color;
}
