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
export const ExerciseLineVolume: ExerciseLineType = {
	name: ``,
	date: ``,
	volume: ``,
};
export const ExerciseLineCardio: ExerciseLineType = {
	name: ``,
	date: ``,
	cardio: ``,
};
export const ExerciseLineScale: ExerciseLineType = {
	name: ``,
	date: ``,
	scale: ``,
};
export const ExerciseAvgVolume: ExerciseAvgType = {
	name: ``,
	date: ``,
	volume: ``,
};
export const ExerciseAvgCardio: ExerciseAvgType = {
	name: ``,
	date: ``,
	cardio: ``,
};
