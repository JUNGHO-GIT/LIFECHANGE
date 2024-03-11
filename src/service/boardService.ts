// boardService.ts

import Board from "../schema/Board";
import * as mongoose from "mongoose";

// 1. boardList ----------------------------------------------------------------------------------->
export const boardList = async (
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
  };

  findResult = await Board.find(findQuery).sort({ _id: -1 });

  return findResult;
};

// 2. boardDetail --------------------------------------------------------------------------------->
export const boardDetail = async (
  _id_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
    _id: _id_param
  };

  findResult = await Board.findOne(findQuery);

  return findResult;
};

// 3. boardInsert --------------------------------------------------------------------------------->
export const boardInsert = async (
  user_id_param: any,
  BOARD_param: any
) => {

  let createQuery;
  let createResult;
  let finalResult;

  createQuery = {
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    board_title : BOARD_param.board_title,
    board_content : BOARD_param.board_content,
    board_date : BOARD_param.board_date,
  };

  createResult = await Board.create(createQuery);

  return createResult;
};

// 4. boardUpdate --------------------------------------------------------------------------------->
export const boardUpdate = async (
  _id_param: any,
  BOARD_param: any
) => {

  let updateQuery;
  let updateResult;
  let finalResult;

  updateQuery = {
    filter_id : {_id : _id_param},
    filter_set : {$set : BOARD_param}
  };

  updateResult = await Board.updateOne(
    updateQuery.filter_id,
    updateQuery.filter_set
  );

  return updateResult;
};

// 5. boardDelete --------------------------------------------------------------------------------->
export const boardDelete = async (
  _id_param: any
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  deleteQuery = {
    _id : _id_param,
  };

  deleteResult = await Board.deleteOne(deleteQuery);

  return deleteResult;
};