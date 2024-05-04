// userService.js

import * as repository from "../repository/userRepository.js";

// 0-0. signup ------------------------------------------------------------------------------------>
export const signup = async (
  user_id_param, user_pw_param
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
    finalResult = "duplicated";
  }

  return finalResult;
};

// 0-1. login ------------------------------------------------------------------------------------->
export const login = async (
  user_id_param, user_pw_param
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

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, sort_param, limit_param, page_param
) => {

  const finalResult = await repository.list(
    user_id_param, sort_param, limit_param, page_param
  );

  return finalResult
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param, _id_param
) => {

  const finalResult = await repository.detail(
    user_id_param, _id_param
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param, OBJECT_param
) => {

  const findResult = await repository.detail(
    user_id_param, ""
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      user_id_param, OBJECT_param
    );
  }
  else {
    finalResult = await repository.update(
      user_id_param, findResult._id, OBJECT_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  user_id_param, _id_param
) => {

  const finalResult = await repository.deletes(
    user_id_param, _id_param
  );

  return finalResult
};