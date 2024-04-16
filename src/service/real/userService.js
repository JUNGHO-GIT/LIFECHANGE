// userService.js

import * as repository from "../../repository/real/userRepository.js";
import bcrypt from "bcrypt";

// 0-0. signup ------------------------------------------------------------------------------------>
export const signup = async (
  user_id_param,
  user_pw_param
) => {

  const findResult = await repository.checkId(
    user_id_param
  );

  let finalResult;
  if (findResult.length === 0) {
    finalResult = await repository.signup(
      user_id_param, user_pw_param
    );
  }
  else {
    finalResult = null;
  }

  return finalResult;
};

// 0-1. login ------------------------------------------------------------------------------------->
export const login = async (
  user_id_param,
  user_pw_param
) => {

  const findResult = await repository.login(
    user_id_param, user_pw_param
  );

  return {
    result: findResult
  }
};

// 0-2. checkId ----------------------------------------------------------------------------------->
export const checkId = async (
  user_id_param,
) => {

  const findResult = await repository.checkId(
    user_id_param
  );

  return findResult;
};

// 1-1. dataset ----------------------------------------------------------------------------------->
export const dataset = async (
  user_id_param
) => {

  const findResult = await repository.aggregateDataset (
    user_id_param
  );

  return findResult;
};

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  sort_param,
  limit_param,
  page_param
) => {

  const finalResult = await repository.find(
    user_id_param, sort_param, limit_param, page_param
  );

  return finalResult
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param
) => {

  const finalResult = await repository.detail(
    _id_param, user_id_param
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  USER_param
) => {

  const findResult = await repository.detail(
    "", user_id_param
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      user_id_param, USER_param
    );
  }
  else {
    finalResult = await repository.update(
      findResult._id, USER_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param
) => {

  const finalResult = await repository.deletes(
    _id_param, user_id_param
  );

  return finalResult
};