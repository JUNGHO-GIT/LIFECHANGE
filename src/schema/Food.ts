// Food.ts
import mongoose from "mongoose";

const FoodScheme = new mongoose.Schema ({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type  : String,
    required : true
  },
  food_name : {
    type : String,
    required : true
  },
  food_brand : {
    type : String,
    required : true
  },
  food_category : {
    type : String,
    required : true
  },
  food_serving : {
    type : String,
    required : true
  },
  food_calories : {
    type : Number,
    required : true
  },
  food_carb : {
    type : Number,
    required : true
  },
  food_protein : {
    type : Number,
    required : true
  },
  food_fat : {
    type : Number,
    required : true
  },
  food_regdate : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  },
  food_update : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  },
  food_select : {
    type : String,
    default : "daily",
    required : false
  }
});

export default mongoose.model("food", FoodScheme);