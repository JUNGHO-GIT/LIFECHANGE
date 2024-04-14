// Work.js

import mongoose from "mongoose";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  work_number: {
    type : Number,
    unique : true
  },

  work_startDt : {
    type: String,
    required: false
  },
  work_endDt : {
    type: String,
    required: false
  },

  work_start: {
    type: String,
    required: false,
  },
  work_end: {
    type: String,
    required: false,
  },
  work_time: {
    type: String,
    required: false,
  },

  work_section: [{
    work_part_idx : {
      type: Number,
      required: false,
    },
    work_part_val : {
      type: String,
      required: false,
    },
    work_title_idx : {
      type: Number,
      required: false,
    },
    work_title_val : {
      type: String,
      required: false,
    },
    work_kg: {
      type: Number,
      required: false,
    },
    work_set: {
      type: Number,
      required: false,
    },
    work_rep: {
      type: Number,
      required: false,
    },
    work_rest: {
      type: Number,
      required: false,
    },
  }],

  work_regdate: {
    type: String,
    required: false
  },
  work_update: {
    type: String,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.work_number = await incrementSeq("work_number", "Work");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const Work = mongoose.model(
  "Work", schema, "work"
);