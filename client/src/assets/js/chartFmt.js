// chartFmt.js

// -------------------------------------------------------------------------------------------------
export const handlerY = (
  OBJECT=[{}], array=[""], type="", extra=""
) => {

  let ticks = [];
  let maxValue = 0;
  let topValue = 0;
  let tickInterval = 0;

  if (type === "sleep") {
    maxValue = Math.max(...OBJECT?.map((item) => (
      Math.max(...array?.map((key) => item[key]))
    )));
    topValue = 24;
    tickInterval = 1;
  }
  else if (type === "money") {
    maxValue = Math.max(...OBJECT?.map((item) => (
      Math.max(...array?.map((key) => item[key]))
    )));
    topValue = Math.ceil(maxValue / 100) * 100;
    tickInterval = 100;
  }
  else if (type === "food") {
    maxValue = Math.max(...OBJECT?.map((item) => (
      Math.max(...array?.map((key) => item[key]))
    )));
    topValue = Math.ceil(maxValue / 100) * 100;
    tickInterval = 10;
  }
  else if (type === "exercise") {
    maxValue = Math.max(...OBJECT?.map((item) => (
      Math.max(...array?.map((key) => item[key]))
    )));
    topValue = Math.ceil(maxValue / 100) * 100;
    tickInterval = 10;
  }
  else {
    console.error("handlerY: invalid type");
    throw new Error("handlerY: invalid type");
  }

  // const allZero = OBJECT_VOLUME_WEEK.every(item => item.volume === 0);
  // const adjustedDomain = allZero ? [0, 1] : domain;
  // const adjustedTicks = allZero ? [0, 1] : ticks;

  /* let extraStr = "";
  if (extra === "volume") {
    extraStr = "volume";
  }
  else if (extra === "cardio") {
    extraStr = "cardio";
  }
  else {
    console.error("handlerY: invalid extra");
    throw new Error("handlerY: invalid extra");
  } */

  /* if (allZero) {
    topValue = 1;
    tickInterval = 1;
    ticks = [0, 1];
  }
  else {
    for (let i = 0; i <= topValue; i += tickInterval) {
      ticks.push(i);
    }
  } */

  return {
    domain: [0, topValue],
    ticks: ticks,
    formatterY: (tick) => (`${Number(tick).toLocaleString()}`)
  };
};
