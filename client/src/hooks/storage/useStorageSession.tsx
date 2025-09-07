// useStorageSession.tsx

import { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "@importReacts";
import { getSession, setSession } from "@importScripts";

// -------------------------------------------------------------------------------------------------
export const useStorageSession = <T,>(
  key1: string,
  key2: string,
  key3: string,
  initialVal: T
): [T, Dispatch<SetStateAction<T>>] => {

  // -----------------------------------------------------------------------------------------------
  const [storedVal, setStoredVal] = useState(() => {
    const existingValue = getSession(key1, key2, key3);
    return existingValue !== undefined ? existingValue : initialVal;
  });

  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    setSession(key1, key2, key3, storedVal);
  }, [key1, key2, key3, storedVal]);

  // -----------------------------------------------------------------------------------------------
  return [storedVal, setStoredVal];
};
