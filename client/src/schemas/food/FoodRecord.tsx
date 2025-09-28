// FoodRecord.tsx

// Types ------------------------------------------------------------------------------------------
export type FoodRecordType = {
	_id: string;
	food_record_number: number;
	food_record_dateType: string;
	food_record_dateStart: string;
	food_record_dateEnd: string;
	food_record_total_kcal: string;
	food_record_total_kcal_color: string;
	food_record_total_carb: string;
	food_record_total_carb_color: string;
	food_record_total_protein: string;
	food_record_total_protein_color: string;
	food_record_total_fat: string;
	food_record_total_fat_color: string;
	food_section: Array<{
		food_record_part: string;
		food_record_name: string;
		food_record_brand: string;
		food_record_count: string;
		food_record_serv: string;
		food_record_gram: string;
		food_record_kcal: string;
		food_record_carb: string;
		food_record_protein: string;
		food_record_fat: string;
	}>;
	food_record_regDt: string;
	food_record_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const FoodRecord: FoodRecordType = {
	_id: "",
	food_record_number: 0,
	food_record_dateType: "",
	food_record_dateStart: "0000-00-00",
	food_record_dateEnd: "0000-00-00",
	food_record_total_kcal: "0",
	food_record_total_kcal_color: "",
	food_record_total_carb: "0",
	food_record_total_carb_color: "",
	food_record_total_protein: "0",
	food_record_total_protein_color: "",
	food_record_total_fat: "0",
	food_record_total_fat_color: "",
	food_section: [{
		food_record_part: "",
		food_record_name: "",
		food_record_brand: "",
		food_record_count: "0",
		food_record_serv: "serv",
		food_record_gram: "0",
		food_record_kcal: "0",
		food_record_carb: "0",
		food_record_protein: "0",
		food_record_fat: "0",
	}],
	food_record_regDt: "",
	food_record_updateDt: "",
};