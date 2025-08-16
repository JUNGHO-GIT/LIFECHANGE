// FoodGoal.tsx

// Types ------------------------------------------------------------------------------------------
export type FoodGoalType = {
	_id: string;

	// goal
	food_goal_number: number;
	food_goal_dateType: string;
	food_goal_dateStart: string;
	food_goal_dateEnd: string;
	food_goal_kcal: string;
	food_goal_kcal_color: string;
	food_goal_carb: string;
	food_goal_carb_color: string;
	food_goal_protein: string;
	food_goal_protein_color: string;
	food_goal_fat: string;
	food_goal_fat_color: string;
	food_goal_regDt: string;
	food_goal_updateDt: string;

	// real
	food_dateType: string;
	food_dateStart: string;
	food_dateEnd: string;
	food_total_kcal: string;
	food_total_kcal_color: string;
	food_total_carb: string;
	food_total_carb_color: string;
	food_total_protein: string;
	food_total_protein_color: string;
	food_total_fat: string;
	food_total_fat_color: string;
	food_regDt: string;
	food_updateDt: string;

	// diff
	food_diff_kcal: string;
	food_diff_kcal_color: string;
	food_diff_carb: string;
	food_diff_carb_color: string;
	food_diff_protein: string;
	food_diff_protein_color: string;
	food_diff_fat: string;
	food_diff_fat_color: string;
};

// Schema -----------------------------------------------------------------------------------------
export const FoodGoal: FoodGoalType = {
	_id: "",

	// goal
	food_goal_number: 0,
	food_goal_dateType: "",
	food_goal_dateStart: "0000-00-00",
	food_goal_dateEnd: "0000-00-00",
	food_goal_kcal: "0",
	food_goal_kcal_color: "",
	food_goal_carb: "0",
	food_goal_carb_color: "",
	food_goal_protein: "0",
	food_goal_protein_color: "",
	food_goal_fat: "0",
	food_goal_fat_color: "",
	food_goal_regDt: "",
	food_goal_updateDt: "",

	// real
	food_dateType: "",
	food_dateStart: "0000-00-00",
	food_dateEnd: "0000-00-00",
	food_total_kcal: "0",
	food_total_kcal_color: "",
	food_total_carb: "0",
	food_total_carb_color:	 "",
	food_total_protein: "0",
	food_total_protein_color: "",
	food_total_fat: "0",
	food_total_fat_color: "",
	food_regDt: "",
	food_updateDt: "",

	// diff
	food_diff_kcal: "0",
	food_diff_kcal_color: "",
	food_diff_carb: "0",
	food_diff_carb_color: "",
	food_diff_protein: "0",
	food_diff_protein_color: "",
	food_diff_fat: "0",
	food_diff_fat_color: "",
};