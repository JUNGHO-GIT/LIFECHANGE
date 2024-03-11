// Work.ts

import mongoose from "mongoose";
import moment from "moment-timezone";

const WorkScheme = new mongoose.Schema ({

  // 1. id
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },

  // 2. components
  workSection : [{
    work_part_idx : {
      type: Number,
      required: false,
    },
    work_part_val : {
      type: String,
      required: true,
    },
    work_title_idx : {
      type: Number,
      required: false,
    },
    work_title_val : {
      type: String,
      required: true,
    },
    work_kg: {
      type: Number,
      required: true,
    },
    work_set: {
      type: Number,
      required: true,
    },
    work_count: {
      type: Number,
      required: true,
    },
    work_rest: {
      type: Number,
      required: true,
    },
  }],
  work_start: {
    type: String,
    required: true,
  },
  work_end: {
    type: String,
    required: true,
  },
  work_time: {
    type: String,
    required: true,
  },

  // 3. date
  work_day: {
    type: String,
    default: () => {
      return "default";
    },
    required: true,
  },
  work_regdate: {
    type: String,
    default: () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required: true,
  },
  work_update: {
    type: String,
    default: () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required: true,
  },
});

export default mongoose.model("Work", WorkScheme);
