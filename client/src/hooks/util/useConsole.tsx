// useConsole.tsx

import { useEffect } from "@importReacts";

// -------------------------------------------------------------------------------------------------
export const useConsole = (title: string, target: any) => {

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {
		 console.log(`${title} :`, JSON.stringify(target, null, 2));
	}, [title, target]);
};
