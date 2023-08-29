// Routine.ts
import mongoose from "mongoose";

const RoutineScheme = new mongoose.Schema ({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },
  routine_title : {
    type : String,
    required : true
  },
  routine_kg : {
    type : String,
    required : true
  },
  routine_set : {
    type : String,
    required : true
  },
  routine_count : {
    type : String,
    required : true
  },
  routine_rest : {
    type : String,
    required : true
  },
  routine_time : {
    type : String,
    required : true
  },
  routine_regdate : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  },
  routine_update : {
    type : String,
    default : () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  }
});

export default mongoose.model("Routine", RoutineScheme);
