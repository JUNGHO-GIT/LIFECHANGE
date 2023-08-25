// FoodInterface.tsx
interface FoodInterface {
  _id: string;
  user_id: string;
  food_name: string;
  food_brand: string;
  food_serving: string;
  food_calories: number;
  food_carb: number;
  food_protein: number;
  food_fat: number;
  food_calories_goal: number;
  food_regdate: Date;
  food_update: Date;
}

export default FoodInterface;
