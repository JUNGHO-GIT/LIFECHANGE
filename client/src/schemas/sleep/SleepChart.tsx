/**
 * @file SleepChart.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

// Types ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export interface SleepPieType {
  name: string;
  value: number;
}
export interface SleepLineType {
  name: string;
  date: string;
  bedTime?: string;
  wakeTime?: string;
  sleepTime?: string;
}
export interface SleepAvgType {
  name: string;
  date: string;
  bedTime?: string;
  wakeTime?: string;
  sleepTime?: string;
}

// Schema ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const SleepPie: SleepPieType = {
  name: `Empty`,
  value: 100,
};
export const SleepLine: SleepLineType = {
  name: ``,
  date: ``,
  bedTime: `0`,
  wakeTime: `0`,
  sleepTime: `0`,
};
export const SleepAvg: SleepAvgType = {
  name: ``,
  date: ``,
  bedTime: `0`,
  wakeTime: `0`,
  sleepTime: `0`,
};
