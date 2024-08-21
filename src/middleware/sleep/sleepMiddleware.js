// sleepMiddleware.js

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object) => {

  if (!object) {
    return [];
  }

  const makeNonValueColor = (param) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  object?.result?.map((item) => {
    item?.sleep_section?.map((item2) => {
      Object.assign((item2), {
        sleep_bedTime_color: makeNonValueColor(
          item2?.sleep_bedTime
        ),
        sleep_wakeUpTime_color: makeNonValueColor(
          item2?.sleep_wakeUpTime
        ),
        sleep_sleepTime_color: makeNonValueColor(
          item2?.sleep_sleepTime
        ),
      });
    });
  });

  return object;
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (object) => {
  if (object === "deleted") {
    return {};
  }
  return object;
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (object) => {
  if (object === "deleted") {
    return {};
  }
  return object;
};