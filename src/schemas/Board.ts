// Board.ts
import mongoose from "mongoose";

const BoardScheme = new mongoose.Schema ({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },
  board_title : {
    type : String,
    required : true
  },
  board_content :{
    type : String,
    required : true
  },
  board_regdate : {
    type : String,
    default: () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  },
  board_update : {
    type : String,
    default: () => {
      const date = new Date();
      date.setHours(date.getHours() + 9);
      return date.toISOString().split('T')[0];
    },
    required : true
  }
});

export default mongoose.model("Board", BoardScheme);
