// Food.ts
import mongoose from "mongoose";
import moment from "moment-timezone";

const FoodScheme = new mongoose.Schema ({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type  : String,
    required : true
  },
  food_title : {
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
  food_select : {
    type : String,
    default : "daily",
    required : false
  },
  foodDay : {
    type : String,
    default : () => {
      return "default";
    },
    required : true
  },
  food_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  },
  food_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  }
});

export default mongoose.model("food", FoodScheme);