export const handlerY = (value, array) => {

  const ticks = [];
  const maxValue = Math.max(...value?.map((item) => Math.max(...array.map((key) => item[key]))));
  let topValue = Math.ceil(maxValue / 100) * 100;

  // topValue에 따른 동적 틱 간격 설정
  let tickInterval = 10;
  if (topValue > 50) {
    tickInterval = 50;
  }
  else if (topValue > 100) {
    tickInterval = 100;
  }
  else if (topValue > 500) {
    tickInterval = 500;
  }
  else if (topValue > 100) {
    tickInterval = 100;
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