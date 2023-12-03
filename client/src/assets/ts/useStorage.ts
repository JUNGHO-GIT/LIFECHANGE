import React, {useState, useEffect} from "react";
import {parseISO, formatISO} from "date-fns";

// ------------------------------------------------------------------------------------------------>
type SetStoredVal<T> = React.Dispatch <React.SetStateAction<T>>;

// ------------------------------------------------------------------------------------------------>
export function useStorage<T> (key: string, initialVal: T)  {

  const datePattern = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}");
  const item = localStorage.getItem(key);

  // ---------------------------------------------------------------------------------------------->
  const [storedVal, setStoredVal] = useState<T> (() => {
    try {
      if (item === null) {
        return initialVal;
      }
      else if (datePattern.test(item.trim())) {
        const parsedDate = parseISO(item);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format");
        }
        return parsedDate as unknown as T;
      }
      else if (typeof item === "string") {
        try {
          return JSON.parse(item) as T;
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
    val : storedVal,
    setVal : setStoredVal as SetStoredVal<T>,
  };
}
