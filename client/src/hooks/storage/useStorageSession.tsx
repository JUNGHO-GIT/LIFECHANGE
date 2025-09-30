// useStorageSession.tsx

import { useEffect, useState } from "@importReacts";
import { fnGetSession, fnSetSession } from "@importScripts";
import { Dispatch, SetStateAction } from "react";

// -------------------------------------------------------------------------------------------------
export const useStorageSession = <T,> (
	key1: string,
	key2: string,
	key3: string,
	initialVal: T
): [T, Dispatch<SetStateAction<T>>] => {

	// -----------------------------------------------------------------------------------------------
	const [storedVal, setStoredVal] = useState(() => {
		const existingValue = fnGetSession(key1, key2, key3);
		return existingValue !== undefined ? existingValue : initialVal;
	});

	// -----------------------------------------------------------------------------------------------
	useEffect(() => {
		fnSetSession(key1, key2, key3, storedVal);
	}, [key1, key2, key3, storedVal]);

	// -----------------------------------------------------------------------------------------------
	return [
		storedVal,
		setStoredVal
	];
};
