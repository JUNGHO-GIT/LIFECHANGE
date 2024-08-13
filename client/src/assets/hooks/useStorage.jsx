// useStorage.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {parseISO, formatISO} from "../../import/ImportLibs.jsx";

// -------------------------------------------------------------------------------------------------
export const useStorage = (key, initialVal) => {

  // -----------------------------------------------------------------------------------------------
  const datePattern = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}");

  // -----------------------------------------------------------------------------------------------
  const getInitialValue = () => {
    if (typeof sessionStorage === "undefined") {
      return initialVal;
    }

    const item = sessionStorage.getItem(key);

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
    catch (error) {
      console.error("Failed to parse sessionStorage item:", error);
      return initialVal;
    }
  };

  const [storedVal, setStoredVal] = useState(getInitialValue);

  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const saveToSessionStorage = () => {
      if (typeof sessionStorage === "undefined") {
        console.warn("sessionStorage is not available.");
        return;
      }

      try {
        const valueToStore = storedVal instanceof Date && !isNaN(storedVal.getTime())
          ? formatISO(storedVal)
          : JSON.stringify(storedVal);
        sessionStorage.setItem(key, valueToStore);
      }
      catch (error) {
        console.error("Failed to save to sessionStorage:", error);
      }
    };

    saveToSessionStorage();
  }, [key, storedVal]);

  return [storedVal, setStoredVal];
};
