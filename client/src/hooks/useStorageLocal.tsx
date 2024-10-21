// useStorageLocal.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { parseISO, formatISO } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const useStorageLocal = (key: string, initialVal: any) => {

  // -----------------------------------------------------------------------------------------------
  const datePattern = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}");

  // -----------------------------------------------------------------------------------------------
  const getInitialValue = () => {
    if (typeof localStorage === "undefined") {
      return initialVal;
    }

    const item = localStorage.getItem(key);

    if (item === null) {
      return initialVal;
    }

    if (datePattern.test(item.trim())) {
      const parsedDate = parseISO(item);
      return isNaN(parsedDate.getTime()) ? initialVal : parsedDate;
    }

    try {
      const parsed = JSON.parse(item);
      return parsed !== undefined ? parsed : initialVal;
    }
    catch (err: any) {
      console.error("Failed to parse localStorage item:", err);
      return initialVal;
    }
  };

  const [storedVal, setStoredVal] = useState<any>(getInitialValue);

  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const saveToSessionStorage = () => {
      if (typeof localStorage === "undefined") {
        console.warn("localStorage is not available.");
        return;
      }

      try {
        const valueToStore = storedVal instanceof Date && !isNaN(storedVal.getTime())
        ? formatISO(storedVal)
        : JSON.stringify(storedVal);

        localStorage.setItem(key, valueToStore);
      }
      catch (err: any) {
        console.error("Failed to save to localStorage:", err);
      }
    };

    saveToSessionStorage();
  }, [key, storedVal]);

  // -----------------------------------------------------------------------------------------------
  return [storedVal, setStoredVal];
};
