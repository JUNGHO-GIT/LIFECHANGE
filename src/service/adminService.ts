// adminService.ts
import User from "../../src/model/User";

// load users list -------------------------------------------------------------------------------->
export const userList = async () => {
  return User.find();
};
