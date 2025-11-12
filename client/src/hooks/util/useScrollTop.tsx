// useScrollTop.tsx

import { useCommonValue } from "@exportHooks";
import { useEffect } from "@exportReacts";

// -------------------------------------------------------------------------------------------------
export const useScrollTop = () => {

	// 1. common ----------------------------------------------------------------------------------
	const { PATH } = useCommonValue();

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [PATH]);
};
