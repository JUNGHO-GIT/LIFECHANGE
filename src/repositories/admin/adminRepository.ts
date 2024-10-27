// adminRepository.ts

import { User } from "@schemas/user/User";

// 0. userCount ------------------------------------------------------------------------------------
export const userCount = async (
) => {

  const finalResult:any = await User.countDocuments();

  return finalResult;
};