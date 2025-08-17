// useStorageLocal.tsx

import { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "@importReacts";
import { getLocal, setLocal } from "@importScripts";

// -------------------------------------------------------------------------------------------------
export type UseStorageLocalType<T> = [T, Dispatch<SetStateAction<T>>];

// -------------------------------------------------------------------------------------------------
export const useStorageLocal = <T,>(
  key1: string,
  key2: string,
  key3: string,
  initialVal: T
): UseStorageLocalType<T> => {

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
  return [storedVal, setStoredVal];
};
