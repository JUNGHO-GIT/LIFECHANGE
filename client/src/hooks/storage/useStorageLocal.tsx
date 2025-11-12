// useStorageLocal.tsx

import { useEffect, useState } from "@importReacts";
import { getLocal, setLocal } from "@importScripts";
import { Dispatch, SetStateAction } from "react";

// -------------------------------------------------------------------------------------------------
export const useStorageLocal = <T,> (
	key1: string,
	key2: string,
	key3: string,
	initialVal: T
): [T, Dispatch<SetStateAction<T>>] => {

	// -----------------------------------------------------------------------------------------------
	const [storedVal, setStoredVal] = useState<T>(() => {
		const existingValue = getLocal(key1, key2, key3) as T | undefined;
		return existingValue !== undefined ? existingValue : initialVal;
	});

	// -----------------------------------------------------------------------------------------------
	useEffect(() => {
		setLocal(key1, key2, key3, storedVal);
	}, [key1, key2, key3, storedVal]);

	// -----------------------------------------------------------------------------------------------
	return [
		storedVal,
		setStoredVal
	];
};
