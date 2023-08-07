// boardService.ts
import Board from "../model/Board";
import * as mongoose from "mongoose";

// boardList -------------------------------------------------------------------------------------->
export const boardList = async () => {
  return Board.find();
};

// boardWrite ------------------------------------------------------------------------------------->
export const boardWrite = async (
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

// boardDetail ------------------------------------------------------------------------------------>

// boardUpdate ------------------------------------------------------------------------------------>

// boardDelete ------------------------------------------------------------------------------------>