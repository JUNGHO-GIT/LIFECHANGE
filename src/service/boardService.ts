// boardService.ts
import Board from "../model/Board";

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
    boardId: boardIdParam,
    boardTitle: boardTitleParam,
    boardContent: boardContentParam,
    boardDate: boardDateParam
  });
};

// boardDetail ------------------------------------------------------------------------------------>

// boardUpdate ------------------------------------------------------------------------------------>

// boardDelete ------------------------------------------------------------------------------------>