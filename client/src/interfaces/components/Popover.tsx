// Popover.tsx

import { useEffect, useRef } from "@importReacts";
import { Popover as MuiPopover } from "@importMuis";
import { PopoverProps } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const Popover = (props: PopoverProps) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // style 속성 자체를 제거
  useEffect(() => {
    if (popoverRef.current) {
      popoverRef.current.removeAttribute("style");
    }
  }, []);

  return (
    <MuiPopover
      {...props}
      ref={popoverRef}
      component={"div"}
      className={props?.className || ""}
    />
  );
};
