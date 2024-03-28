// boardService.js

import mongoose from "mongoose";
import {Board} from "../schema/Board.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
) => {

  let findQuery;
  let findResult;
  let finalResult;

  findQuery = {
  };

  findResult = await Board.find(findQuery).sort({ _id: -1 });

  return findResult;
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param
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

// 3. insert -------------------------------------------------------------------------------------->
export const insert = async (
  user_id_param,
  BOARD_param
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

// 4. update -------------------------------------------------------------------------------------->
export const update = async (
  _id_param,
  BOARD_param
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

// 5. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param
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