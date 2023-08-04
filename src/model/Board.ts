// Board.ts
import mongoose from "mongoose";

const BoardScheme = new mongoose.Schema({
  boardId: String,
  boardTitle: String,
  boardContent: String,
  boardDate: String,
});

const Board = mongoose.model("Board", BoardScheme);

export default Board;
