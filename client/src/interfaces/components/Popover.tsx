/**
 * @file Popover.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { Popover as MuiPopover, type PopoverProps } from "@exportMuis";
import { memo, type React, useEffect, useRef } from "@exportReacts";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Popover = memo((props: PopoverProps) => {
	const paperRef: React.RefObject<HTMLDivElement | null> =
		useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (paperRef.current) {
			paperRef.current.removeAttribute(`style`);
		}
	}, []);

	const mrgdSltPrps = {
		...props.slotProps,
		paper: {
			...props.slotProps?.paper,
			ref: paperRef,
			component: `div`,
		},
	};

	return (
		<MuiPopover
			{...props}
			slotProps={mrgdSltPrps as PopoverProps[`slotProps`]}
		/>
	);
});
