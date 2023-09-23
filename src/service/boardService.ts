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
  _id_param :any
) => {
  const boardDetail = await Board.findOne ({
    _id : _id_param,
  });
  return boardDetail;
};

// 3. boardInsert --------------------------------------------------------------------------------->
export const boardInsert = async (
  user_id_param :any,
  BOARD_param :any
) => {
  const boardInsert = await Board.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    board_title : BOARD_param.board_title,
    board_content : BOARD_param.board_content,
    board_date : BOARD_param.board_date,
  });
  return boardInsert;
};

// 4. boardUpdate --------------------------------------------------------------------------------->
export const boardUpdate = async (
  _id_param :any,
  BOARD_param :any
) => {
  const boardUpdate = await Board.updateOne (
    {_id : _id_param},
    {$set : BOARD_param}
  );
  return boardUpdate;
};

// 5. boardDelete --------------------------------------------------------------------------------->
export const boardDelete = async (
  _id_param :any
) => {
  const boardDelete = await Board.deleteOne ({
    _id : _id_param,
  });
  return boardDelete;
};
