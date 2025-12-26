/**
 * @file FoodRecord.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import mongoose from "mongoose";
import { incrementSeq } from "@schemas/Counter";

// 0. types ---------------------------------------------------------------------------------------
declare type FoodRecordSection = {
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
};
declare type FoodRecordType = mongoose.Document & {
	user_id: string;
	food_record_number: number;
	food_record_dateType: string;
	food_record_dateStart: string;
	food_record_dateEnd: string;
	food_record_total_kcal: string;
	food_record_total_carb: string;
	food_record_total_protein: string;
	food_record_total_fat: string;
	food_section: FoodRecordSection[];
	food_record_regDt: Date;
	food_record_updateDt: Date;
};

// 1. schema ---------------------------------------------------------------------------------------
const schema = new mongoose.Schema({
	user_id: {
		type: String,
		default: ``,
		required: true
	},
	food_record_number: {
		type: Number,
		default: 0,
		unique: true
	},
	food_record_dateType: {
		type: String,
		default: ``,
		required: false
	},
	food_record_dateStart: {
		type: String,
		default: `0000-00-00`,
		required: false
	},
	food_record_dateEnd: {
		type: String,
		default: `0000-00-00`,
		required: false
	},
	food_record_total_kcal: {
		type: String,
		default: ``,
		required: false
	},
	food_record_total_carb: {
		type: String,
		default: ``,
		required: false
	},
	food_record_total_protein: {
		type: String,
		default: ``,
		required: false
	},
	food_record_total_fat: {
		type: String,
		default: ``,
		required: false
	},
	food_section: [
		{
			food_record_part: {
				type: String,
				default: ``,
				required: false
			},
			food_record_name: {
				type: String,
				default: ``,
				required: false
			},
			food_record_brand: {
				type: String,
				default: ``,
				required: false
			},
			food_record_count: {
				type: String,
				default: ``,
				required: false
			},
			food_record_serv: {
				type: String,
				default: ``,
				required: false
			},
			food_record_gram: {
				type: String,
				default: ``,
				required: false
			},
			food_record_kcal: {
				type: String,
				default: ``,
				required: false
			},
			food_record_carb: {
				type: String,
				default: ``,
				required: false
			},
			food_record_protein: {
				type: String,
				default: ``,
				required: false
			},
			food_record_fat: {
				type: String,
				default: ``,
				required: false
			}
		}
	],
	food_record_regDt: {
		type: Date,
		default: Date.now,
		required: false
	},
	food_record_updateDt: {
		type: Date,
		default: Date.now,
		required: false
	}
}, {
	collection: `FoodRecord`,
	timestamps: {
		createdAt: `food_record_regDt`,
		updatedAt: `food_record_updateDt`
	}
});

// 3. counter --------------------------------------------------------------------------------------
schema.pre<FoodRecordType>(`save`, async function() {
	if (this.isNew) {
		this.food_record_number = await incrementSeq(`food_record_number`, `FoodRecord`);
	}
});

// 5. model ----------------------------------------------------------------------------------------
export const FoodRecord = mongoose.model<FoodRecordType>(`FoodRecord`, schema);
