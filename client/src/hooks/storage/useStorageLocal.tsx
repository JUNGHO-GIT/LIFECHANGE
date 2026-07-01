/**
 * @file useStorageLocal.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useEffect, useState, useRef } from "@exportReacts";
import { getLocal, setLocal } from "@exportScripts";
import { Dispatch, SetStateAction } from "react";

// -------------------------------------------------------------------------------------------------
export const useStorageLocal = <T,> (
  key1: string,
  key2: string,
  key3: string,
  initialVal: T,
): [T, Dispatch<SetStateAction<T>>] => {

  // -----------------------------------------------------------------------------------------------
  const keySig: string = `${key1}::${key2}::${key3}`;
  const prevKeySigRef: React.RefObject<string> = useRef<string>(keySig);
  const skipWriteOnceRef: React.RefObject<boolean> = useRef<boolean>(false);

  // -----------------------------------------------------------------------------------------------
  const [ storedVal, setStoredVal ] = useState<T>(() => {
    const existingValue: T | undefined = getLocal(key1, key2, key3) as T | undefined;
    return existingValue ?? initialVal;
  });

  // -----------------------------------------------------------------------------------------------
  // key 변경 시: 해당 key로 다시 읽어서 재수화 (old state를 new key로 덮어쓰는 것을 방지)
  useEffect(() => {
    const prevKeySig: string = prevKeySigRef.current;
    if (prevKeySig !== keySig) {
      prevKeySigRef.current = keySig;
      skipWriteOnceRef.current = true;

      const existingValue: T | undefined = getLocal(key1, key2, key3) as T | undefined;
      setStoredVal(existingValue ?? initialVal);
    }
  }, [ keySig, key1, key2, key3 ]);

  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    if (skipWriteOnceRef.current) {
      skipWriteOnceRef.current = false;
      return;
    }

    setLocal(key1, key2, key3, storedVal);
  }, [ key1, key2, key3, storedVal ]);

  // -----------------------------------------------------------------------------------------------
  return [
    storedVal,
    setStoredVal,
  ];
};
