// boardService.ts
import Board from "../schemas/Board";
import * as mongoose from "mongoose";

// 1. boardList ----------------------------------------------------------------------------------->
export const boardList = async (
) => {
  const boardList = await Board.find();
  return boardList;
};

// 2. boardDetail --------------------------------------------------------------------------------->
export const boardDetail = async (
  _id_param: any
) => {
  const boardDetail = await Board.findOne ({
    _id: _id_param,
  });
  return boardDetail;
};

// 3. boardInsert --------------------------------------------------------------------------------->
export const boardInsert = async (
  user_id_param: string,
  board_title_param: string,
  board_content_param: string,
  board_date_param: string
) => {
  const boardInsert = await Board.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    board_title: board_title_param,
    board_content: board_content_param,
    board_date: board_date_param,
  });
  return boardInsert;
};

// 4. boardUpdate --------------------------------------------------------------------------------->
export const boardUpdate = async (
  _id_param: any,
  board_param: any
) => {
  const boardUpdate = await Board.updateOne(
    { _id: _id_param }, // Query
    { $set: board_param } // Update
  );

  return boardUpdate;
};

// 5. boardDelete --------------------------------------------------------------------------------->
export const boardDelete = async (
  _id_param: any
) => {
  const boardDelete = await Board.deleteOne({
    _id: _id_param,
  });
  return boardDelete;
};
