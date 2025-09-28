// useScrollTop.tsx

import { useCommonValue } from "@importHooks";
import { useEffect } from "@importReacts";

// -------------------------------------------------------------------------------------------------
export const useScrollTop = () => {

	// 1. common ----------------------------------------------------------------------------------
	const { PATH } = useCommonValue();

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [PATH]);
};
