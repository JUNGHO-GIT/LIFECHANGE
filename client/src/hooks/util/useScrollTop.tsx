/**
 * @file useScrollTop.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useCommonValue as usCmmnVal } from "@exportHooks";
import { useEffect } from "@exportReacts";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const useScrollTop = () => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { PATH } = usCmmnVal();

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [PATH]);
};
