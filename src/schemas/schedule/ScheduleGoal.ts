// ScheduleGoal.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
	user_id: {
		type: String,
		default: "",
		required: true
	},
	schedule_goal_number: {
		type: Number,
		default: 0,
		unique: true
	},
	schedule_goal_dateType: {
		type: String,
		default: "",
		required: false
	},
	schedule_goal_dateStart: {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_goal_dateEnd: {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_goal_title: {
		type: String,
		default: "",
		required: false
	},
	schedule_goal_content: {
		type: String,
		default: "",
		required: false
	},
	schedule_goal_target: {
		type: String,
		default: "",
		required: false
	},
	schedule_goal_unit: {
		type: String,
		default: "",
		required: false
	},
	schedule_goal_current: {
		type: String,
		default: "0",
		required: false
	},
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
		this.schedule_goal_number = await incrementSeq("schedule_goal_number", "ScheduleGoal");
	}
	next();
});

// 5. model ----------------------------------------------------------------------------------------
export const ScheduleGoal = mongoose.model(
	"ScheduleGoal", schema, "schedule_goal"
);
