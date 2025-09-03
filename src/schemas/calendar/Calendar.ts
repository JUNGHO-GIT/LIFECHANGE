// Calendar.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  calendar_number: {
    type: Number,
    default: 0,
    unique : true
  },
	calendar_dateType: {
		type: String,
		default: "",
		required: false
	},
	calendar_dateStart: {
		type: String,
		default: "0000-00-00",
		required: false
	},
	calendar_dateEnd: {
		type: String,
		default: "0000-00-00",
		required: false
	},

	// 1. exercise
  calendar_exercise_dateType : {
    type: String,
    default: "",
    required: false
  },
  calendar_exercise_dateStart : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  calendar_exercise_dateEnd : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  calendar_exercise_section: [{
    exercise_part : {
      type: String,
      default: "",
      required: false,
    },
    exercise_title : {
      type: String,
      default: "",
      required: false,
    },
    exercise_weight: {
      type: String,
      default: "",
      required: false,
    },
    exercise_set: {
      type: String,
      default: "",
      required: false,
    },
    exercise_rep: {
      type: String,
      default: "",
      required: false,
    },
    exercise_volume: {
      type: String,
      default: "",
      required: false
    },
    exercise_cardio: {
      type: String,
      default: "00:00",
      required: false,
    },
  }],

	// 2. food
  calendar_food_dateType : {
    type: String,
    default: "",
    required: false
  },
  calendar_food_dateStart : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  calendar_food_dateEnd : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  calendar_food_section: [{
    food_part: {
      type: String,
      default: "",
      required: false,
    },
    food_name : {
      type: String,
      default: "",
      required: false,
    },
    food_brand : {
      type: String,
      default: "",
      required: false
    },
    food_count : {
      type: String,
      default: "",
      required: false
    },
    food_serv : {
      type: String,
      default: "",
      required: false
    },
    food_gram : {
      type: String,
      default: "",
      required: false
    },
    food_kcal : {
      type: String,
      default: "",
      required: false
    },
    food_carb : {
      type: String,
      default: "",
      required: false
    },
    food_protein : {
      type: String,
      default: "",
      required: false
    },
    food_fat : {
      type: String,
      default: "",
      required: false
    },
  }],

	// 3. money
  calendar_money_dateType : {
    type: String,
    default: "",
    required: false
  },
  calendar_money_dateStart : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  calendar_money_dateEnd : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  calendar_money_section: [{
    money_part : {
      type: String,
      default: "",
      required: false
    },
    money_title : {
      type: String,
      default: "",
      required: false
    },
    money_include : {
      type: String,
      default: "Y",
      required: false
    },
    money_amount : {
      type: String,
      default: 0,
      required: false
    },
    money_content :{
      type: String,
      default: "",
      required: false
    },
  }],

	// 4. sleep
  calendar_sleep_dateType : {
    type: String,
    default: "",
    required: false
  },
  calendar_sleep_dateStart : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  calendar_sleep_dateEnd : {
    type: String,
    default: "0000-00-00",
    required: false
  },
  calendar_sleep_section: [{
    sleep_bedTime: {
      type: String,
      default: "00:00",
      required: false
    },
    sleep_wakeTime: {
      type: String,
      default: "00:00",
      required: false
    },
    sleep_sleepTime: {
      type: String,
      default: "00:00",
      required: false
    }
  }],

  calendar_regDt: {
    type: Date,
    default: Date.now,
    required: false
  },
  calendar_updateDt: {
    type: Date,
    default: Date.now,
    required: false
  }
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.calendar_number = await incrementSeq("calendar_number", "Calendar");
  }
  next();
});

// 5. model ----------------------------------------------------------------------------------------
export const Calendar = mongoose.model(
  "Calendar", schema, "calendar"
);