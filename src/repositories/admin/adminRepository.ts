// adminRepository.ts

import { User } from "@schemas/user/User";

// 1. userCount ------------------------------------------------------------------------------------
export const userCount = async (
) => {

  const finalResult:any = await User.countDocuments();

  return finalResult;
};