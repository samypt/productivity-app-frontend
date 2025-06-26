import { useEffect } from "react";

interface Props {
  ref: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  enabled?: boolean;
}

export function useClickOutside({ ref, onClose, enabled }: Props) {
  useEffect(() => {
    if (enabled === false) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onClose, enabled]);

  return null;
}
