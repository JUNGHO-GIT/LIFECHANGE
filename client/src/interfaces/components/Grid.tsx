/**
 * @file Grid.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { type GridProps, Grid as MuiGrid } from "@exportMuis";
import { memo, type React, useEffect, useRef } from "@exportReacts";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Grid = memo((props: GridProps) => {
	const cardRef: React.RefObject<HTMLDivElement | null> =
		useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (cardRef.current) {
			cardRef.current.removeAttribute(`style`);
		}
	}, []);

	return (
		<MuiGrid
			{...props}
			ref={cardRef}
			component={`div`}
			className={props?.className ?? ``}
		/>
	);
});
