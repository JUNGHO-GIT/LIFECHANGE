// Work.ts
import mongoose from "mongoose";
import moment from "moment-timezone";

const WorkScheme = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  workSection : {
    work_part: {
      type: String,
      required: true,
    },
    work_title: {
      type: String,
      required: true,
    },
    work_kg: {
      type: String,
      required: true,
    },
    work_set: {
      type: String,
      required: true,
    },
    work_count: {
      type: String,
      required: true,
    },
    work_rest: {
      type: String,
      required: true,
    },
  },
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
