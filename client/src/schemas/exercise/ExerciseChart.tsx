/**
 * @file ExerciseChart.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

// Types ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export interface ExercisePieType {
	name: string;
	value: number;
}
export interface ExerciseLineType {
	name: string;
	date: string;
	volume?: string;
	cardio?: string;
	scale?: string;
}
export interface ExerciseAvgType {
	name: string;
	date: string;
	volume?: string;
	cardio?: string;
}

// Schema ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const ExercisePie: ExercisePieType = {
	name: `Empty`,
	value: 100,
};
export const ExerLnVol: ExerciseLineType = {
	name: ``,
	date: ``,
	volume: ``,
};
export const ExerLnCrd: ExerciseLineType = {
	name: ``,
	date: ``,
	cardio: ``,
};
export const ExerLnScl: ExerciseLineType = {
	name: ``,
	date: ``,
	scale: ``,
};
export const ExerAvgVol: ExerciseAvgType = {
	name: ``,
	date: ``,
	volume: ``,
};
export const ExerAvgCrd: ExerciseAvgType = {
	name: ``,
	date: ``,
	cardio: ``,
};
