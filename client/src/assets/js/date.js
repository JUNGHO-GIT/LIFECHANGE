// date.js

// 1. strToDecimal -------------------------------------------------------------------------------->
export const strToDecimal = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

// 2. decimalToStr -------------------------------------------------------------------------------->
export const decimalToStr = (time) => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};