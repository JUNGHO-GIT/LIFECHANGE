// sleepMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  const makeNonValueColor = (param: string) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  object?.result?.forEach((item: any) => {
    item?.existDate?.forEach((item2: any) => {
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