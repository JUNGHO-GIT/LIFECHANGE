// ExerciseChart.tsx

// Types ------------------------------------------------------------------------------------------
export type ExercisePieType = {
	name: string;
	value: number;
};
export type ExerciseLineType = {
	name: string;
	date: string;
	volume?: string;
	cardio?: string;
	scale?: string;
};
export type ExerciseAvgType = {
	name: string;
	date: string;
	volume?: string;
	cardio?: string;
};

// Schema -----------------------------------------------------------------------------------------
export const ExercisePie: ExercisePieType = {
	name: "Empty",
	value: 100,
};
export const ExerciseLineVolume: ExerciseLineType = {
	name: "",
	date: "",
	volume: "",
};
export const ExerciseLineCardio: ExerciseLineType = {
	name: "",
	date: "",
	cardio: "",
};
export const ExerciseLineScale: ExerciseLineType = {
	name: "",
	date: "",
	scale: "",
};
export const ExerciseAvgVolume: ExerciseAvgType = {
	name: "",
	date: "",
	volume: "",
};
export const ExerciseAvgCardio: ExerciseAvgType = {
	name: "",
	date: "",
	cardio: "",
};