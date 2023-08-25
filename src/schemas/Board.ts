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
    default : () => new Date().toISOString().split('T')[0],
    required : true
  },
  board_update : {
    type : String,
    default : () => new Date().toISOString().split('T')[0],
    required : true
  }
});

export default mongoose.model("Board", BoardScheme);
