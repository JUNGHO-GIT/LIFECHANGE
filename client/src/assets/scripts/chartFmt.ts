// chartFmt.js

// -------------------------------------------------------------------------------------------------
export const handleY = (
  OBJECT: any,
  array: any,
  type: string,
) => {

  let ticks = [];
  let topValue = 0;
  let tickInterval = 0;
  let maxValue = 0;

  // 숫자 변환 및 NaN 처리
  OBJECT = OBJECT.map((item: any) => {
    let newItem: any = {};
    for (let key in item) {
      newItem[key] = Number(item[key] || 0);
    }
    return newItem;
  });

  if (type === "sleep") {
    topValue = 24;
    tickInterval = 1;
    maxValue = Math.max(...OBJECT.map((item: any) => (
      Math.max(...array.map((key: any) => (
        Number(item[key] || 0)
      )))
    )));
  }
  else if (type === "money") {
    topValue = Math.ceil(maxValue / 100) * 100;
    tickInterval = 100;
    maxValue = Math.max(...OBJECT.map((item: any) => (
      Math.max(...array.map((key: any) => (
        Number(item[key] || 0)
      )))
    )));
  }
  else if (type === "food") {
    topValue = Math.ceil(maxValue / 100) * 100;
    tickInterval = 10;
    maxValue = Math.max(...OBJECT.map((item: any) => (
      Math.max(...array.map((key: any) => (
        Number(item[key] || 0)
      )))
    )));
  }
  else if (type === "exercise") {
    topValue = Math.ceil(maxValue / 100) * 100;
    tickInterval = 10;
    maxValue = Math.max(...OBJECT.map((item: any) => (
      Math.max(...array.map((key: any) => (
        Number(item[key] || 0)
      )))
    )));
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
