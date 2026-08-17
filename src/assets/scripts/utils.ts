/**
 * @file utils.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import crypto from "node:crypto";
import { loadEnv } from "@assets/scripts/env";
import bcrypt from "bcryptjs";

loadEnv();

// 1-1. number -------------------------------------------------------------------------------------
export const randomNumber = (data: number) => Math.floor(Math.random() * data);
// 1-2. time ---------------------------------------------------------------------------------------
export const randomTime = () => {
  const hour: string = Math.floor(Math.random() * 23)
    .toString()
    .padStart(2, `0`);
  const minute: string = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, `0`);

  return `${hour}:${minute}`;
};
// 1-3. date ---------------------------------------------------------------------------------------
export const calcDate = (startTime: string, endTime: string) => {
  const start: Date = new Date(`1970/01/01 ${startTime}`);
  const end: Date = new Date(`1970/01/01 ${endTime}`);
  // 차이가 음수(자정 넘김)일 때만 24h 보정. 같은 날 범위는 보정하지 않는다.
  // 차이(ms)는 타임존 독립적이므로 UTC 접근자로 시:분을 읽어 로컬 오프셋 영향을 제거한다.
  const dayMs: number = 24 * 60 * 60 * 1000;
  const diff: number = Number(end) - Number(start);
  const duration: Date = new Date(diff < 0 ? diff + dayMs : diff);

  return `${duration.getUTCHours().toString().padStart(2, `0`)}:${duration.getUTCMinutes().toString().padStart(2, `0`)}`;
};

// 1-2. format -------------------------------------------------------------------------------------
export const timeToDecimal = (data: string) => {
  if (
    typeof data !== `string` ||
    !data ||
    data === null ||
    data === undefined
  ) {
    return 0;
  }
  const time: string[] = data.split(`:`);
  if (time?.length !== 2) {
    return 0;
  }
  // 10분 단위로 반올림
  const hours: number = Number.parseFloat(time[0]);
  const minutes: number =
    (Math.round(Number.parseFloat(time[1]) / 10) * 10) / 60;

  return hours + minutes;
};

export const decimalToTime = (data: number) => {
  if (
    typeof data !== `number` ||
    !data ||
    Number.isNaN(data) ||
    data === null ||
    data === undefined
  ) {
    return `00:00`;
  }
  // 10분 단위로 반올림
  const floatHours: number = Number.parseFloat(data.toString());
  const hours: number = Math.floor(floatHours);
  const minutes: number = Math.round(((floatHours - hours) * 60) / 10) * 10;

  return `${hours.toString().padStart(2, `0`)}:${minutes.toString().padStart(2, `0`)}`;
};

// 1-2. convert ------------------------------------------------------------------------------------
export const strToDecimal = (data: string) => {
  if (!data || data === null || data === undefined) {
    return 0;
  }
  const [hours, minutes] = data.split(`:`).map(Number);
  const adjustedHours: number = hours + Math.floor(minutes / 60);
  const adjustedMinutes: number = minutes % 60;

  return adjustedHours + adjustedMinutes / 60;
};

export const decimalToStr = (data: number) => {
  if (!data || Number.isNaN(data) || data === null || data === undefined) {
    return `00:00`;
  }
  const hours: number = Math.floor(data);
  const minutes: number = Math.round((data - hours) * 60);
  const adjustedHours: number = hours + Math.floor(minutes / 60);
  const adjustedMinutes: number = minutes % 60;

  return `${String(adjustedHours).padStart(2, `0`)}:${String(adjustedMinutes).padStart(2, `0`)}`;
};

// 4-1. token --------------------------------------------------------------------------------------
export const token: string = crypto.randomBytes(20).toString(`hex`);

// 4-2. adminCheck ---------------------------------------------------------------------------------
export const isAdmin = (user_id: string) => {
  const adminId: string | undefined = process.env.ADMIN_ID;

  if (user_id === adminId) {
    return true;
  }
  return false;
};

// 4-3. combinePw ----------------------------------------------------------------------------------
export const combinePw = async (inputPw: string, tokenParam: string) => {
  return `${inputPw}_${tokenParam}`;
};

// 4-4. hashPw -------------------------------------------------------------------------------------
export const hashPw = async (combinedPw: string) => {
  return bcrypt.hash(combinedPw, 10);
};

// 4-5. comparePw ----------------------------------------------------------------------------------
export const comparePw = async (inputPw: string, storedPw: string) => {
  return bcrypt.compare(inputPw, storedPw);
};

// 5-1. toNumber -------------------------------------------------------------------------------------
export const toNumber = (value?: string | number | null): number => {
  const normalized: string = String(value ?? `0`).replaceAll(`,`, ``).trim().toLowerCase();
  const unit: string = normalized.slice(-1);
  const numericText: string = unit === `k` || unit === `m`
    ? normalized.slice(0, -1)
    : normalized;
  const multiplier: number = unit === `m` ? 1_000_000 : unit === `k` ? 1_000 : 1;
  const result: number = Number(numericText) * multiplier;
  return Number.isFinite(result) ? result : 0;
};

// 5-2. toMinutes ------------------------------------------------------------------------------------
export const toMinutes = (value?: string | number | null): number => {
  const [ hours = `0`, minutes = `0` ] = String(value ?? `00:00`).split(`:`);
  const result: number = (Number(hours) * 60) + Number(minutes);
  return Number.isFinite(result) ? result : 0;
};

// 5-3. average --------------------------------------------------------------------------------------
export const average = (values: number[]): number => {
  return values.length > 0
    ? values.reduce((sum: number, value: number) => sum + value, 0) / values.length
    : 0;
};

// 5-4. clockAverage ---------------------------------------------------------------------------------
export const clockAverage = (values: number[]): number => {
  if (values.length === 0) {
    return 0;
  }
  const radians: number[] = values.map((value: number) => (value / 1_440) * Math.PI * 2);
  const sinAvg: number = average(radians.map((value: number) => Math.sin(value)));
  const cosAvg: number = average(radians.map((value: number) => Math.cos(value)));
  const angle: number = Math.atan2(sinAvg, cosAvg);
  const normalized: number = angle < 0 ? angle + (Math.PI * 2) : angle;
  return Math.round((normalized / (Math.PI * 2)) * 1_440) % 1_440;
};

// 6-1. GoalChartMetric ------------------------------------------------------------------------------
export declare interface GoalChartMetric {
  key: string;
  goal: number;
  record: number;
  percent: number;
}

// 6-2. createMetric -----------------------------------------------------------------------------------
export const createMetric = (
  key: string,
  goal: number,
  record: number,
  inverse: boolean = false,
): GoalChartMetric => {
  const percent: number = goal <= 0
    ? 0
    : inverse
      ? record <= goal ? 100 : Math.round((goal / record) * 100)
      : Math.round((record / goal) * 100);
  return {
    key,
    goal: Math.round(goal * 10) / 10,
    record: Math.round(record * 10) / 10,
    percent,
  };
};

// 6-3. createClockMetric --------------------------------------------------------------------------------
export const createClockMetric = (
  key: string,
  goal: number,
  record: number,
): GoalChartMetric => {
  const diff: number = Math.min(Math.abs(record - goal), 1_440 - Math.abs(record - goal));
  const percent: number = goal <= 0 || record <= 0
    ? 0
    : diff <= 10 ? 100 : diff <= 20 ? 80 : diff <= 40 ? 60 : diff <= 60 ? 40 : 0;
  return { key, goal, record, percent };
};

// 6-4. createToleranceMetric -----------------------------------------------------------------------------
export const createToleranceMetric = (
  key: string,
  goal: number,
  record: number,
): GoalChartMetric => {
  const diff: number = Math.abs(record - goal);
  const percent: number = goal <= 0
    ? 0
    : diff <= 10 ? 100 : diff <= 20 ? 80 : diff <= 40 ? 60 : diff <= 60 ? 40 : 0;
  return { key, goal, record, percent };
};
