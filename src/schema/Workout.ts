// Workout.ts
import mongoose from "mongoose";
import moment from "moment-timezone";

const WorkoutScheme = new mongoose.Schema ({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },
  workout_part : {
    type : String,
    required : true
  },
  workout_title : {
    type : String,
    required : true
  },
  workout_kg : {
    type : String,
    required : true
  },
  workout_set : {
    type : String,
    required : true
  },
  workout_count : {
    type : String,
    required : true
  },
  workout_rest : {
    type : String,
    required : true
  },
  workout_time : {
    type : String,
    required : true
  },
  workout_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  },
  workout_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  }
});

export default mongoose.model("Workout", WorkoutScheme);
