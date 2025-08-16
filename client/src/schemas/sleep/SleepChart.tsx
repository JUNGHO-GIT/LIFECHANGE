// SleepChart.tsx

// Types ------------------------------------------------------------------------------------------
export type SleepPieType = {
	name: string;
	value: number;
};
export type SleepLineType = {
	name: string;
	date: string;
	bedTime?: string;
	wakeTime?: string;
	sleepTime?: string;
};
export type SleepAvgType = {
	name: string;
	date: string;
	bedTime?: string;
	wakeTime?: string;
	sleepTime?: string;
};

// Schema -----------------------------------------------------------------------------------------
export const SleepPie: SleepPieType = {
	name: "Empty",
	value: 100,
};
export const SleepLine: SleepLineType = {
	name: "",
	date: "",
	bedTime: "0",
	wakeTime: "0",
	sleepTime: "0",
};
export const SleepAvg: SleepAvgType = {
	name: "",
	date: "",
	bedTime: "0",
	wakeTime: "0",
	sleepTime: "0",
};