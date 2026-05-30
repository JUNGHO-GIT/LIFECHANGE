/**
 * @file useFoodSection.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useCommonValue as usCmmnVal } from "@exportHooks";
import { useEffect } from "@exportReacts";
import { setSession } from "@exportScripts";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const usFdSec = () => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { PATH } = usCmmnVal();

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		if (
			!PATH.includes(`food/find`) &&
			!PATH.includes(`food/favorite`) &&
			!PATH.includes(`food/record`)
		) {
			setSession(`section`, `food`, ``, []);
		}
	}, [PATH]);
};
