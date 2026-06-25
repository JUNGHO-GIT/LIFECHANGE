/**
 * @file MoneyChart.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

// Types ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export interface MoneyPieType {
  name: string;
  value: number;
}
export interface MoneyLineType {
  name: string;
  date: string;
  income?: string;
  expense?: string;
}
export interface MoneyAvgType {
  name: string;
  date: string;
  income?: string;
  expense?: string;
}

// Schema ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const MoneyPie: MoneyPieType = {
  name: `Empty`,
  value: 100,
};
export const MoneyLine: MoneyLineType = {
  name: ``,
  date: ``,
  income: `0`,
  expense: `0`,
};
export const MoneyAvg: MoneyAvgType = {
  name: ``,
  date: ``,
  income: `0`,
  expense: `0`,
};
