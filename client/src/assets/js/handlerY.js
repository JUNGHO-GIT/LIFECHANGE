// handlerY.js

// ------------------------------------------------------------------------------------------------>
export const handlerY = (
  value=[{}], array=[""], type=""
) => {

  let ticks = [];
  let maxValue = 0;
  let topValue = 0;
  let tickInterval = 0;
  
  if (type === "sleep") {
    maxValue = Math.max(...value?.map((item) => (
      Math.max(...array.map((key) => item[key]))
    )));
    topValue = 24;
    tickInterval = 1;
  }
  else if (type === "money") {
    maxValue = Math.max(...value?.map((item) => (
      Math.max(...array.map((key) => item[key]))
    )));
    topValue = Math.ceil(maxValue / 100) * 100;
    tickInterval = 1000;
  }
  else if (type === "food") {
    maxValue = Math.max(...value?.map((item) => (
      Math.max(...array.map((key) => item[key]))
    )));
    topValue = Math.ceil(maxValue / 100) * 100;
    tickInterval = 100
  }
  else if (type === "exercise") {
    maxValue = Math.max(...value?.map((item) => (
      Math.max(...array.map((key) => item[key]))
    )));
    topValue = Math.ceil(maxValue / 100) * 100;
    tickInterval = 100
  }

  for (let i = 0; i <= topValue; i += tickInterval) {
    ticks.push(i);
  }
  
  return {
    domain: [0, topValue],
    ticks: ticks,
    tickFormatter: (tick) => (`${Number(tick).toLocaleString()}`)
  };
};