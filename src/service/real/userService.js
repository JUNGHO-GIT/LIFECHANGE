// userService.js

import * as repo from "../../repository/real/userRepo.js";

// 0-1. login ------------------------------------------------------------------------------------->
export const login = async (
  user_id_param,
  user_pw_param
) => {

  const findResult = await repo.detail(
    "", user_id_param, user_pw_param
  );

  return findResult;
};

// 0-2. checkId ----------------------------------------------------------------------------------->
export const checkId = async (
  user_id_param,
) => {

  const findResult = await repo.checkId(
    user_id_param
  );

  return findResult;
};

// 1-1. dataset ----------------------------------------------------------------------------------->
export const dataset = async (
  user_id_param,
  user_pw_param
) => {

  const findResult = await repo.aggregateDataset (
    user_id_param, user_pw_param
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

  const finalResult = await repo.find(
    user_id_param, sort_param, limit_param, page_param
  );

  return {
    result: finalResult
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  user_pw_param
) => {

  const finalResult = await repo.detail(
    _id_param, user_id_param, user_pw_param
  );

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  user_pw_param,
  USER_param
) => {

  const findResult = await repo.detail(
    "", user_id_param, user_pw_param
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repo.create(
      user_id_param, USER_param
    );
  }
  else {
    finalResult = await repo.update(
      findResult._id, USER_param
    );
  }

  return {
    result: finalResult
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param
) => {

  const finalResult = await repo.deletes(
    _id_param, user_id_param
  );

  return {
    result: finalResult
  };
};