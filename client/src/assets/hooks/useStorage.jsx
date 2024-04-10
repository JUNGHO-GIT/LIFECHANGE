// useStorage.jsx

import React, { useState, useEffect } from "react";
import { parseISO, formatISO } from "date-fns";

// ------------------------------------------------------------------------------------------------>
export const useStorage = (key, initialVal) => {
  const datePattern = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}");
  const item = localStorage.getItem(key);

  // ---------------------------------------------------------------------------------------------->
  const [storedVal, setStoredVal] = useState(() => {
    try {
      if (item === null) {
        return initialVal;
      }
      else if (datePattern.test(item.trim())) {
        const parsedDate = parseISO(item);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format");
        }
        return parsedDate;
      }
      else if (typeof item === "string") {
        try {
          return JSON.parse(item);
        }
        catch {
          return initialVal;
        }
      }
      else {
        return item;
      }
    }
    catch (error) {
      console.error(error);
      return initialVal;
    }
  });

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    try {
      if (storedVal instanceof Date && !isNaN(storedVal.getTime())) {
        localStorage.setItem(key, formatISO(storedVal));
      }
      else {
        localStorage.setItem(key, JSON.stringify(storedVal));
      }
    }
    catch (error) {
      console.error(error);
    }
  }, [key, storedVal]);

  // ---------------------------------------------------------------------------------------------->
  return {
    val: storedVal,
    set: setStoredVal,
  };
};