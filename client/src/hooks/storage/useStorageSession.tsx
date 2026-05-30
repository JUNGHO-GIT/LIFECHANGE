/**
 * @file useStorageSession.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useEffect, useRef, useState } from "@exportReacts";
import { getSession, setSession } from "@exportScripts";
import type { Dispatch, SetStateAction as StStActn } from "react";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const usStrgSess = <T,>(
	key1: string,
	key2: string,
	key3: string,
	initialVal: T,
): [T, Dispatch<StStActn<T>>] => {
	// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const keySig: string = `${key1}::${key2}::${key3}`;
	const prvKySgRf: React.RefObject<string> = useRef<string>(keySig);
	const skpWrtOncRf: React.RefObject<boolean> = useRef<boolean>(false);

	// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const [storedVal, setStoredVal] = useState<T>(() => {
		const exstVal: T | undefined = getSession(key1, key2, key3) as
			| T
			| undefined;
		return exstVal ?? initialVal;
	});

	// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	// key 변경 시: 해당 key로 다시 읽어서 재수화 (old state를 new key로 덮어쓰는 것을 방지)
	useEffect(() => {
		const prevKeySig: string = prvKySgRf.current;
		if (prevKeySig !== keySig) {
			prvKySgRf.current = keySig;
			skpWrtOncRf.current = true;

			const exstVal: T | undefined = getSession(key1, key2, key3) as
				| T
				| undefined;
			setStoredVal(exstVal ?? initialVal);
		}
	}, [keySig, key1, key2, key3]);

	// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		if (skpWrtOncRf.current) {
			skpWrtOncRf.current = false;
			return;
		}

		setSession(key1, key2, key3, storedVal);
	}, [key1, key2, key3, storedVal]);

	// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	return [storedVal, setStoredVal];
};
