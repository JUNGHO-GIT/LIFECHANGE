// Board.ts

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter";

const BoardSchema = new mongoose.Schema ({

  // 1. id
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },

  // 2. components
  board_title : {
    type : String,
    required : true
  },
  board_content :{
    type : String,
    required : true
  },

  // 3. date
  board_day : {
    type : String,
    default : () => {
      return "default";
    },
    required : true
  },
  board_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required : true
  },
  board_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD-HH:mm:ss");
    },
    required : true
  }
});

export default mongoose.model("Board", BoardSchema);
