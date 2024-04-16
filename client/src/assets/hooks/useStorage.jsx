// useStorage.jsx

import React, {useState, useEffect} from "react";
import {parseISO, formatISO} from "date-fns";

export const useStorage = (key, initialVal) => {
  const datePattern = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}");

  // ---------------------------------------------------------------------------------------------->
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item === null) {
      return initialVal;
    }
    else if (datePattern.test(item.trim())) {
      const parsedDate = parseISO(item);
      return isNaN(parsedDate.getTime()) ? initialVal : parsedDate;
    }
    else {
      try {
        const parsed = JSON.parse(item);
        return parsed !== undefined ? parsed : initialVal;
      }
      catch {
        return initialVal;
      }
    }
  };

  const [storedVal, setStoredVal] = useState(getInitialValue);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {

    const saveToLocalStorage = () => {
      try {
        const valueToStore = storedVal instanceof Date && !isNaN(storedVal.getTime()) ? formatISO(storedVal) : JSON.stringify(storedVal);
        localStorage.setItem(key, valueToStore);
      }
      catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    };

    saveToLocalStorage();
  }, [key, storedVal]);

  return {
    val: storedVal,
    set: setStoredVal,
  };
};