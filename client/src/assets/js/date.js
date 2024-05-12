// date.js

import moment from "moment-timezone";

// 1. common -------------------------------------------------------------------------------------->
export const newDate = moment().tz("Asia/Seoul");
export const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
export const curWeekStart = moment().tz("Asia/Seoul").startOf("isoWeek");
export const curWeekEnd = moment().tz("Asia/Seoul").endOf("isoWeek");
export const curMonthStart = moment().tz("Asia/Seoul").startOf("month");
export const curMonthEnd = moment().tz("Asia/Seoul").endOf("month");
export const curYearStart = moment().tz("Asia/Seoul").startOf("year");
export const curYearEnd = moment().tz("Asia/Seoul").endOf("year");

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