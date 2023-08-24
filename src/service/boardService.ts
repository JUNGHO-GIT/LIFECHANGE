// boardService.ts
import Board from "../model/Board";
import * as mongoose from "mongoose";

// 1. boardList ----------------------------------------------------------------------------------->
export const boardList = async () => {
  return Board.find();
};

// 2. boardDetail --------------------------------------------------------------------------------->
export const boardDetail = async (
  boardIdParam: String
) => {
  return Board.findOne({
    _id: boardIdParam
  });
};

// 3. boardInsert --------------------------------------------------------------------------------->
export const boardInsert = async (
  boardIdParam: String,
  boardTitleParam: String,
  boardContentParam: String,
  boardDateParam: String
) => {
  return Board.create({
    _id: new mongoose.Types.ObjectId(),
    boardId: boardIdParam,
    boardTitle: boardTitleParam,
    boardContent: boardContentParam,
    boardDate: boardDateParam
  });
};

// 4. boardUpdate --------------------------------------------------------------------------------->
export const boardUpdate = async (
  _id: String,
  board: any
) => {
  return Board.updateOne({
    _id: _id
  }, board);
};

// 5. boardDelete --------------------------------------------------------------------------------->
export const boardDelete = async (
  _id: String
) => {
  return Board.deleteOne({
    _id: _id
  });
};

