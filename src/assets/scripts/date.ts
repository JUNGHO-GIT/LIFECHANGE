// date.ts

import moment from "moment-timezone";

// 1. common ---------------------------------------------------------------------------------------
export const newDate = moment().tz("Asia/Seoul");
export const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
export const curWeekStart = moment().tz("Asia/Seoul").startOf("isoWeek");
export const curWeekEnd = moment().tz("Asia/Seoul").endOf("isoWeek");
export const curMonthStart = moment().tz("Asia/Seoul").startOf("month");
export const curMonthEnd = moment().tz("Asia/Seoul").endOf("month");
export const curYearStart = moment().tz("Asia/Seoul").startOf("year");
export const curYearEnd = moment().tz("Asia/Seoul").endOf("year");

