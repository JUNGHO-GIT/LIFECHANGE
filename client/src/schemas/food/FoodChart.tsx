// FoodChart.tsx

// Types ------------------------------------------------------------------------------------------
export type FoodPieType = {
	name: string;
	value: number;
};
export type FoodLineType = {
	name: string;
	date: string;
	kcal?: string;
	carb?: string;
	protein?: string;
	fat?: string;
};
export type FoodAvgType = {
	name: string;
	date: string;
	kcal?: string;
	carb?: string;
	protein?: string;
	fat?: string;
};

// Schema -----------------------------------------------------------------------------------------
export const FoodPie: FoodPieType = {
	name: "Empty",
	value: 100,
};
export const FoodLineKcal: FoodLineType = {
	name: "",
	date: "",
	kcal: "",
};
export const FoodLineNut: FoodLineType = {
	name: "",
	date: "",
	carb: "",
	protein: "",
	fat: "",
};
export const FoodAvgKcal: FoodAvgType = {
	name: "",
	date: "",
	kcal: "",
};
export const FoodAvgNut: FoodAvgType = {
	name: "",
	date: "",
	carb: "",
	protein: "",
	fat: "",
};