// useDiffTime.jsx

import React, { useState, useEffect } from "react";

// ------------------------------------------------------------------------------------------------>
export const useDiffTime = (
  OBJECT, setOBJECT,
  PATH, strDate,
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const strLow = PATH.split("/")[1];

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const startTime = OBJECT[`${strLow}_real`]?.[`${strLow}_start`]?.toString();
    const endTime = OBJECT[`${strLow}_real`]?.[`${strLow}_end`]?.toString();

    if (startTime && endTime) {
      const startDate = new Date(`${strDate}T${startTime}`);
      const endDate = new Date(`${strDate}T${endTime}`);

      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      setOBJECT((prev) => ({
        ...prev,
        [`${strLow}_real`]: {
          ...prev[`${strLow}_real`],
          [`${strLow}_time`]: time,
        },
      }));
    }
  }, [OBJECT, strDate, strLow]);
};