// Board.ts
import mongoose from "mongoose";

const BoardScheme = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  boardId: String,
  boardTitle: String,
  boardContent: String,
  boardDate: String,
});

export default mongoose.model("Board", BoardScheme);
