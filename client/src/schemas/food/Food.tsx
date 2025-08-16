// Food.tsx

// Types ------------------------------------------------------------------------------------------
export type FoodType = {
	_id: string;
	food_number: number;
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
	food_section: Array<{
		food_part: string;
		food_name: string;
		food_brand: string;
		food_count: string;
		food_serv: string;
		food_gram: string;
		food_kcal: string;
		food_carb: string;
		food_protein: string;
		food_fat: string;
	}>;
	food_regDt: string;
	food_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const Food: FoodType = {
	_id: "",
	food_number: 0,
	food_dateType: "",
	food_dateStart: "0000-00-00",
	food_dateEnd: "0000-00-00",
	food_total_kcal: "0",
	food_total_kcal_color: "",
	food_total_carb: "0",
	food_total_carb_color: "",
	food_total_protein: "0",
	food_total_protein_color: "",
	food_total_fat: "0",
	food_total_fat_color: "",
	food_section: [{
		food_part: "",
		food_name: "",
		food_brand: "",
		food_count: "0",
		food_serv: "serv",
		food_gram: "0",
		food_kcal: "0",
		food_carb: "0",
		food_protein: "0",
		food_fat: "0",
	}],
	food_regDt: "",
	food_updateDt: "",
};