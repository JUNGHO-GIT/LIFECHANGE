// adminService.ts

import * as repository from "@repositories/admin/adminRepository";

// 0. userCount ------------------------------------------------------------------------------------
export const userCount = async (
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  findResult = await repository.userCount();

  if (!findResult || findResult.length <= 0) {
    finalResult = [];
    statusResult = "fail";
  }
  else {
    finalResult = findResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};