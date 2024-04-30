// customerService.js

import * as repository from "../repository/customerRepository.js";

// 0-0. signup ------------------------------------------------------------------------------------>
export const signup = async (
  customer_id_param, customer_pw_param
) => {

  const findResult = await repository.checkId(
    customer_id_param
  );

  let finalResult;
  if (findResult.length === 0) {
    finalResult = await repository.signup(
      customer_id_param, customer_pw_param
    );
  }
  else {
    finalResult = "duplicated";
  }

  return finalResult;
};

// 0-1. login ------------------------------------------------------------------------------------->
export const login = async (
  customer_id_param, customer_pw_param
) => {

  const findResult = await repository.login(
    customer_id_param, customer_pw_param
  );

  return {
    result: findResult
  }
};

// 0-2. checkId ----------------------------------------------------------------------------------->
export const checkId = async (
  customer_id_param,
) => {

  const findResult = await repository.checkId(
    customer_id_param
  );

  return findResult;
};

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, sort_param, limit_param, page_param
) => {

  const finalResult = await repository.list(
    customer_id_param, sort_param, limit_param, page_param
  );

  return finalResult
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  customer_id_param, _id_param
) => {

  const finalResult = await repository.detail(
    customer_id_param, _id_param
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  customer_id_param, OBJECT_param
) => {

  const findResult = await repository.detail(
    customer_id_param, ""
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      customer_id_param, OBJECT_param
    );
  }
  else {
    finalResult = await repository.update(
      customer_id_param, findResult._id, OBJECT_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  customer_id_param, _id_param
) => {

  const finalResult = await repository.deletes(
    customer_id_param, _id_param
  );

  return finalResult
};