// adminService.ts
import User from "../schemas/User";

// load users list -------------------------------------------------------------------------------->
export const userList = async () => {
  return User.find();
};
