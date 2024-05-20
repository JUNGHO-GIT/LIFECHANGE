// userService.js

import * as repository from "../../repository/user/userRepository.js";

// 0-0. signup ------------------------------------------------------------------------------------>
export const signup = async (
  user_id_param, user_pw_param
) => {

  const findResult = await repository.signup.checkId(
    user_id_param
  );

  let finalResult = null;
  if (findResult.length === 0) {
    finalResult = await repository.signup.signup(
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

  const findResult = await repository.login.login(
    user_id_param, user_pw_param
  );

  let finalResult = null;
  if (findResult !== null) {
    finalResult = findResult;
  }
  else {
    finalResult = "fail";
  }

  return finalResult;
};

// 2. detail (상세는 eq) -------------------------------------------------------------------------->
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
  user_id_param, OBJECT_param, DATE_param
) => {

  const findResult = await repository.save.detail(
    user_id_param, ""
  );

  let finalResult = null;
  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param
    );
  }
  else {
    finalResult = await repository.save.update(
      user_id_param, findResult._id, OBJECT_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  user_id_param, _id_param
) => {

  const finalResult = await repository.deletes.deletes(
    user_id_param, _id_param
  );

  return finalResult
};