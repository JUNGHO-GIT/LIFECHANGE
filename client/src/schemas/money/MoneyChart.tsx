// MoneyChart.tsx

// Types ------------------------------------------------------------------------------------------
export type MoneyPieType = {
	name: string;
	value: number;
};
export type MoneyLineType = {
	name: string;
	date: string;
	income?: string;
	expense?: string;
};
export type MoneyAvgType = {
	name: string;
	date: string;
	income?: string;
	expense?: string;
};

// Schema -----------------------------------------------------------------------------------------
export const MoneyPie: MoneyPieType = {
	name: "Empty",
	value: 100,
};
export const MoneyLine: MoneyLineType = {
	name: "",
	date: "",
	income: "0",
	expense: "0",
};
export const MoneyAvg: MoneyAvgType = {
	name: "",
	date: "",
	income: "0",
	expense: "0",
};