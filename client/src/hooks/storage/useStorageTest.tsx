// useStorageTest.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { getLocal, setLocal } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const useStorageTest = (key1: string, key2: string, key3: string, initialVal: any) => {

  // -----------------------------------------------------------------------------------------------
  const [storedVal, setStoredVal] = useState<any>(() => {
    return getLocal(key1, key2, key3) || initialVal;
  });

  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    setLocal(key1, key2, key3, storedVal);
  }, [key1, key2, key3, storedVal]);

  // -----------------------------------------------------------------------------------------------
  return [storedVal, setStoredVal];
};
