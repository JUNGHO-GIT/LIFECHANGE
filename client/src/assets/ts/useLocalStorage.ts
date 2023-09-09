// useLocalStorage.ts
import React, { useState, useEffect } from "react";
import { parseISO, formatISO } from "date-fns";

type SetStoredValue<T> = React.Dispatch<React.SetStateAction<T>>;

export function useLocalStorage<T>(key: string, initialValue: T) {

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      const datePattern = new RegExp(
        "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"
      );
      if (datePattern.test(item.trim())) {
        const parsedDate = parseISO(item);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format");
        }
        return parsedDate as unknown as T;
      }
      if (typeof item === "string") {
        return JSON.parse(item) as T;
      }
      return item;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (storedValue instanceof Date && !isNaN(storedValue.getTime())) {
        localStorage.setItem(key, formatISO(storedValue));
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return {
    value: storedValue,
    setValue: setStoredValue as SetStoredValue<T>
  };
}
