// Blocker.tsx
import { useEffect } from "react";
import { createPortal } from "react-dom";

export const Blocker = ({ active }: { active: boolean }) => {
  if (!active) {
    return null;
  }

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div
      className="app-blocker"
      role="presentation"
      aria-hidden="true"
      tabIndex={-1}
    >
    </div>,
    document.body
  );
}
