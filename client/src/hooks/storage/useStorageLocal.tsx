// useStorageLocal.tsx

import { useState, useEffect } from "@importReacts";
import { getLocal, setLocal } from "@importScripts";

// -------------------------------------------------------------------------------------------------
export const useStorageLocal = (key1: string, key2: string, key3: string, initialVal: any) => {

  // -----------------------------------------------------------------------------------------------
  const [storedVal, setStoredVal] = useState(() => {
    const existingValue = getLocal(key1, key2, key3);
    return existingValue !== undefined ? existingValue : initialVal;
  });

  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    setLocal(key1, key2, key3, storedVal);
  }, [key1, key2, key3, storedVal]);

  // -----------------------------------------------------------------------------------------------
  return [storedVal, setStoredVal];
};
