// SchedulePlanner.ts

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
	user_id: {
		type: String,
		default: "",
		required: true
	},
	schedule_planner_number: {
		type: Number,
		default: 0,
		unique: true
	},
	schedule_planner_dateType: {
		type: String,
		default: "",
		required: false
	},
	schedule_planner_dateStart: {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_planner_dateEnd: {
		type: String,
		default: "0000-00-00",
		required: false
	},
	schedule_planner_title: {
		type: String,
		default: "",
		required: false
	},
	schedule_planner_content: {
		type: String,
		default: "",
		required: false
	},
	schedule_planner_priority: {
		type: String,
		default: "normal",
		required: false
	},
	schedule_planner_status: {
		type: String,
		default: "pending",
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
		this.schedule_planner_number = await incrementSeq("schedule_planner_number", "SchedulePlanner");
	}
	next();
});

// 5. model ----------------------------------------------------------------------------------------
export const SchedulePlanner = mongoose.model(
	"SchedulePlanner", schema, "schedule_planner"
);
