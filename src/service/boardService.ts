// boardService.ts
import Board from "../schema/Board";
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
  _id_param : any
) => {
  const boardDetail = await Board.findOne ({
    _id : _id_param,
  });
  return boardDetail;
};

// 3. boardInsert --------------------------------------------------------------------------------->
export const boardInsert = async (
  board_param : any
) => {
  const boardInsert = await Board.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : board_param.user_id,
    board_title : board_param.board_title,
    board_content : board_param.board_content,
    board_date : board_param.board_date,
  });
  return boardInsert;
};

// 4. boardUpdate --------------------------------------------------------------------------------->
export const boardUpdate = async (
  _id_param : any,
  board_param : any
) => {
  const boardUpdate = await Board.updateOne(
    { _id : _id_param }, // Query
    { $set : board_param } // Update
  );

  return boardUpdate;
};

// 5. boardDelete --------------------------------------------------------------------------------->
export const boardDelete = async (
  _id_param : any
) => {
  const boardDelete = await Board.deleteOne({
    _id : _id_param,
  });
  return boardDelete;
};
