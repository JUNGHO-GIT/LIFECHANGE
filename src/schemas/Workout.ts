// Workout.ts
import mongoose from "mongoose";

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
  workout_name : {
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
  workout_kg : {
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
  workout_image : {
    type : String,
    required : true
  },
  workout_regdate : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  },
  workout_update : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  }
});

export default mongoose.model("Workout", WorkoutScheme);
