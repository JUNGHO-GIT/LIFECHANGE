// boardService.ts
import Board from "../schemas/Board";
import * as mongoose from "mongoose";

// 1. boardList ----------------------------------------------------------------------------------->
export const boardList = async (
) => {
  const boardList = await Board.find (
  );
  return boardList;
};

// 2. boardDetail --------------------------------------------------------------------------------->
export const boardDetail = async (
  board_id_param : any
) => {
  const boardDetail = await Board.findOne ({
    board_id : board_id_param
  });
  return boardDetail;
};

// 3. boardInsert --------------------------------------------------------------------------------->
export const boardInsert = async (
  board_id_param : string,
  board_title_param : string,
  board_content_param : string,
  board_date_param : string
) => {
  const boardInsert = await Board.create ({
    _id: new mongoose.Types.ObjectId(),
    board_id : board_id_param,
    board_title : board_title_param,
    board_content : board_content_param,
    board_date : board_date_param
  });
  return boardInsert;
};

// 4. boardUpdate --------------------------------------------------------------------------------->
export const boardUpdate = async (
  _id_param : any,
  board_param : any
) => {
  const boardUpdate = await Board.updateOne ({
    _id : _id_param,
    board : board_param
  });
  return boardUpdate;
};

// 5. boardDelete --------------------------------------------------------------------------------->
export const boardDelete = async (
  _id_param : any
) => {
  const boardDelete = await Board.deleteOne ({
    _id : _id_param
  });
  return boardDelete;
};

