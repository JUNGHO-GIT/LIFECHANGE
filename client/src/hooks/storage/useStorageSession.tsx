// useStorageSession.tsx

import { useState, useEffect } from "@importReacts";
import { getSession, setSession } from "@importScripts";

// -------------------------------------------------------------------------------------------------
export const useStorageSession = (key1: string, key2: string, key3: string, initialVal: any) => {

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
