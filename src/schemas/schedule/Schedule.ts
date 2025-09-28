// Schedule.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
	user_id: {
		type: String,
		default: "",
		required: true
	},
	schedule_number: {
		type: Number,
		default: 0,
		unique : true
	},
	schedule_dateType: {
		type: String,
		default: "",
		required: false
	},
	schedule_dateStart: {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_dateEnd: {
		type: String,
		default: "0000-00-00",
		required: false
	},

	// 1. exercise
	schedule_exercise_record_dateType : {
		type: String,
		default: "",
		required: false
	},
	schedule_exercise_record_dateStart : {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_exercise_record_dateEnd : {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_exercise_section: [{
		exercise_record_part : {
			type: String,
			default: "",
			required: false,
		},
		exercise_record_title : {
			type: String,
			default: "",
			required: false,
		},
		exercise_record_weight: {
			type: String,
			default: "",
			required: false,
		},
		exercise_record_set: {
			type: String,
			default: "",
			required: false,
		},
		exercise_record_rep: {
			type: String,
			default: "",
			required: false,
		},
		exercise_record_volume: {
			type: String,
			default: "",
			required: false
		},
		exercise_record_cardio: {
			type: String,
			default: "00:00",
			required: false,
		},
	}],

	// 2. food
	schedule_food_record_dateType : {
		type: String,
		default: "",
		required: false
	},
	schedule_food_record_dateStart : {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_food_record_dateEnd : {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_food_section: [{
		food_record_part: {
			type: String,
			default: "",
			required: false,
		},
		food_record_name : {
			type: String,
			default: "",
			required: false,
		},
		food_record_brand : {
			type: String,
			default: "",
			required: false
		},
		food_record_count : {
			type: String,
			default: "",
			required: false
		},
		food_record_serv : {
			type: String,
			default: "",
			required: false
		},
		food_record_gram : {
			type: String,
			default: "",
			required: false
		},
		food_record_kcal : {
			type: String,
			default: "",
			required: false
		},
		food_record_carb : {
			type: String,
			default: "",
			required: false
		},
		food_record_protein : {
			type: String,
			default: "",
			required: false
		},
		food_record_fat : {
			type: String,
			default: "",
			required: false
		},
	}],

	// 3. money
	schedule_money_record_dateType : {
		type: String,
		default: "",
		required: false
	},
	schedule_money_record_dateStart : {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_money_record_dateEnd : {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_money_section: [{
		money_record_part : {
			type: String,
			default: "",
			required: false
		},
		money_record_title : {
			type: String,
			default: "",
			required: false
		},
		money_record_include : {
			type: String,
			default: "Y",
			required: false
		},
		money_record_amount : {
			type: String,
			default: 0,
			required: false
		},
		money_record_content :{
			type: String,
			default: "",
			required: false
		},
	}],

	// 4. sleep
	schedule_sleep_record_dateType : {
		type: String,
		default: "",
		required: false
	},
	schedule_sleep_record_dateStart : {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_sleep_record_dateEnd : {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_sleep_section: [{
		sleep_record_bedTime: {
			type: String,
			default: "00:00",
			required: false
		},
		sleep_record_wakeTime: {
			type: String,
			default: "00:00",
			required: false
		},
		sleep_record_sleepTime: {
			type: String,
			default: "00:00",
			required: false
		}
	}],

	schedule_regDt: {
		type: Date,
		default: Date.now,
		required: false
	},
	schedule_updateDt: {
		type: Date,
		default: Date.now,
		required: false
	}
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre("save", async function(next) {
	if (this.isNew) {
		this.schedule_number = await incrementSeq("schedule_number", "Schedule");
	}
	next();
});

// 5. model ----------------------------------------------------------------------------------------
export const Schedule = mongoose.model(
	"Schedule", schema, "schedule"
);