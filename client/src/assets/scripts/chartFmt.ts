// chartFmt.js

// -------------------------------------------------------------------------------------------------
export const handleY = (
  OBJECT: any,
  array: any,
  type: string,
) => {

  let ticks = [];
  let maxValue = 0;
  let topValue = 0;
  let tickInterval = 0;

  // 숫자 변환 및 NaN 처리
  OBJECT = OBJECT.map((item: any) => {
    let newItem: any = {};
    for (let key in item) {
      newItem[key] = Number(item[key] || 0);
    }
    return newItem;
  });

  if (type === "sleep") {
    maxValue = Math.max(...OBJECT.map((item: any) => (
      Math.max(...array.map((key: any) => (
        item[key] || 0
      )))
    )));
    tickInterval = 1;
    topValue = 24;
  }
  else if (type === "money") {
    maxValue = Math.max(...OBJECT.map((item: any) => (
      Math.max(...array.map((key: any) => (
        item[key] || 0
      )))
    )));
    tickInterval = 100;
    topValue = Math.ceil(maxValue / 100) * 100;
  }
  else if (type === "food") {
    maxValue = Math.max(...OBJECT.map((item: any) => (
      Math.max(...array.map((key: any) => (
        item[key] || 0
      )))
    )));
    tickInterval = 10;
    topValue = Math.ceil(maxValue / 100) * 100;
  }
  else if (type === "exercise") {
    maxValue = Math.max(...OBJECT.map((item: any) => (
      Math.max(...array.map((key: any) => (
        item[key] || 0
      )))
    )));
    tickInterval = 10;
    topValue = Math.ceil(maxValue / 100) * 100;
  }
  else {
    throw new Error("handleY: type error");
  }

  for (let i = 0; i <= topValue; i += tickInterval) {
    ticks.push(i);
  }

  return {
    domain: [0, topValue],
    ticks: ticks,
    formatterY: (tick: any) => (`${Number(tick).toLocaleString()}`)
  };
};