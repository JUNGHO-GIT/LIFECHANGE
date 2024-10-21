// useStorageTest.tsx

import { useState, useEffect } from "@imports/ImportReacts";

// -------------------------------------------------------------------------------------------------
export const useStorageTest = (title: string, key1: string, key2: string, initialVal: any) => {

  // -----------------------------------------------------------------------------------------------
  const getInitialValue = () => {
    const item = localStorage.getItem(title);
    const key1Item = item && JSON.parse(item);
    const key2Item = key1Item && key1Item[key1];
    const value = key2Item && key2Item[key2];

    return value || initialVal;
  }

  // -----------------------------------------------------------------------------------------------
  const [storedVal, setStoredVal] = useState<any>(getInitialValue);

  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const item = localStorage.getItem(title);
    const key1Item = item && JSON.parse(item);
    const key2Item = key1Item && key1Item[key1];
    const valueToStore = {
      ...key1Item,
      [key1]: {
        ...key2Item,
        [key2]: storedVal
      }
    };

    localStorage.setItem(title, JSON.stringify(valueToStore));

  }, [title, key1, key2, storedVal]);

  // -----------------------------------------------------------------------------------------------
  return [
    storedVal,
    setStoredVal
  ];
};
