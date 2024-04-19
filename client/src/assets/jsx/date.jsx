// 1-2. convert ----------------------------------------------------------------------------------->
export const strToDecimal = (time) => {
  console.log(time);
  const newDate = new Date(`1970-01-01T${time}Z`);
  const hours = Math.floor(newDate.getTime() / 3600000);
  const minutes = Math.floor((newDate.getTime() % 3600000) / 60000);
  const returnTime = hours + minutes / 60;

  return returnTime;
};

export const decimalToStr = (time) => {
  console.log(time);
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  const returnTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  return returnTime;
};