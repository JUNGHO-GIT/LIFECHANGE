import {useState, useEffect} from "react";
import {parseISO, formatISO} from "date-fns";

// ---------------------------------------------------------------------------------------------->
export const useStorage = (key, initialVal) => {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        const datePattern = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/;
        if (datePattern.test(item)) {
          const parsedDate = parseISO(item);
          return isNaN(parsedDate.getTime()) ? initialVal : parsedDate;
        }
        return JSON.parse(item);
      }
      catch {
        return item;
      }
    }
    return initialVal;
  });

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    try {
      const isDate = value instanceof Date && !isNaN(value.getTime());
      const saveValue = isDate ? formatISO(value) : JSON.stringify(value);
      localStorage.setItem(key, saveValue);
    }
    catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [key, value]);

  // ---------------------------------------------------------------------------------------------->
  const set = (newValue) => {
    if (typeof newValue === "function") {
      setValue((prev) => {
        const updatedValue = newValue(prev);
        return updatedValue;
      });
    }
    else {
      setValue(newValue);
    }
  };

  return {val: value, set: set};
};
