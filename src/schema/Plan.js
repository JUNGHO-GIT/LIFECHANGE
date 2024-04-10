// Plan.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  plan_number: {
    type : Number,
    unique : true
  },
  plan_dur: {
    type: String,
    required: false
  },

  // 1. food (특정 기간별 칼로리, 탄수화물, 단백질, 지방)
  plan_food: {
    plan_kcal: {
      type: String,
      required: false
    },
    plan_carb: {
      type: String,
      required: false
    },
    plan_protein: {
      type: String,
      required: false
    },
    plan_fat: {
      type: String,
      required: false
    },
  },

  // 2. money (특정 기간별 지출액, 저축액)
  plan_money: {
    plan_out: {
      type: String,
      required: false
    },
    plan_in: {
      type: String,
      required: false
    },
  },

  // 3. sleep (특정 기간별 취침시간, 기상시간, 수면시간)
  plan_sleep: {
    plan_night: {
      type: String,
      required: false
    },
    plan_morning: {
      type: String,
      required: false
    },
    plan_time: {
      type: String,
      required: false
    },
  },

  // 4. work (특정 기간별 운동총 횟수, 특정 운동 횟수, 유산소 시간, 특정운동 1rm)
  plan_work: {
    plan_count_total: {
      type: String,
      required: false
    },
    plan_count_specific: {
      type: String,
      required: false
    },
    plan_cardio_name: {
      type: String,
      required: false
    },
    plan_cardio_time: {
      type: String,
      required: false
    },
    plan_score_name: {
      type: String,
      required: false
    },
    plan_score_kg: {
      type: String,
      required: false
    },
    plan_score_rep: {
      type: String,
      required: false
    },
    plan_score_set: {
      type: String,
      required: false
    },
  },
  plan_regdate: {
    type: String,
    required: false
  },
  plan_update: {
    type: String,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.plan_number = await incrementSeq("plan_number", "Plan");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Plan = mongoose.model(
  "Plan", schema
);