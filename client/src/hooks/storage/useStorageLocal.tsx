// useStorageLocal.tsx

import { useState, useEffect } from "@imports/ImportReacts";

// -------------------------------------------------------------------------------------------------
export const useStorageLocal = (title: string, key1: string, key2: string, initialVal: any) => {

  // -----------------------------------------------------------------------------------------------
  const [storedVal, setStoredVal] = useState<any>(() => {
    const item = localStorage.getItem(title);
    const key1Item = item ? JSON.parse(item) : {};
    const key2Item = key1Item[key1] || {};
    const value = key2Item[key2];

    return value !== undefined ? value : initialVal;
  });

  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const item = localStorage.getItem(title);
    const key1Item = item ? JSON.parse(item) : {};
    const key2Item = key1Item[key1] || {};

    localStorage.setItem(title, JSON.stringify({
      ...key1Item,
      [key1]: {
        ...key2Item,
        [key2]: storedVal
      }
    }));

  }, [title, key1, key2, storedVal]);

  // -----------------------------------------------------------------------------------------------
  return [storedVal, setStoredVal];
};
