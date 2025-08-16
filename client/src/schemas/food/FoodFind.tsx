// FoodFind.tsx

// Types ------------------------------------------------------------------------------------------
export type FoodFindType = {
	food_query: string;
	food_perNumber: number;
	food_part: string;
	food_key: string;
	food_name: string;
	food_name_color: string;
	food_brand: string;
	food_brand_color: string;
	food_count: string;
	food_count_color: string;
	food_serv: string;
	food_serv_color: string;
	food_gram: string;
	food_gram_color: string;
	food_kcal: string;
	food_kcal_color: string;
	food_carb: string;
	food_carb_color: string;
	food_protein: string;
	food_protein_color: string;
	food_fat: string;
	food_fat_color: string;
};

// Schema -----------------------------------------------------------------------------------------
export const FoodFind: FoodFindType = {
	food_query: "",
	food_perNumber: 1,
	food_part: "breakfast",
	food_key: "",
	food_name: "",
	food_name_color: "",
	food_brand: "",
	food_brand_color: "",
	food_count: "0",
	food_count_color: "",
	food_serv: "",
	food_serv_color: "",
	food_gram: "0",
	food_gram_color: "",
	food_kcal: "0",
	food_kcal_color: "",
	food_carb: "0",
	food_carb_color: "",
	food_protein: "0",
	food_protein_color: "",
	food_fat: "0",
	food_fat_color: "",
};