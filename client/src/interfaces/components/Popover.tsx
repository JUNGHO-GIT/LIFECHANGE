// Popover.tsx

import { useEffect, useRef } from "@importReacts";
import { Popover as MuiPopover } from "@importMuis";
import { PopoverProps } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const Popover = (props: PopoverProps) => {
  const paperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (paperRef.current) {
      paperRef.current.removeAttribute("style");
    }
  }, []);

  const mergedSlotProps = {
    ...props.slotProps,
    paper: {
      ...(props.slotProps && props.slotProps.paper ? props.slotProps.paper : {}),
      ref: paperRef,
      component: "div",
    },
  };

  return (
    <MuiPopover
      {...props}
      slotProps={mergedSlotProps}
    />
  );
};
