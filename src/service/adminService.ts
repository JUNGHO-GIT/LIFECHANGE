import User from "../../src/model/User";

export const userList = async (userListParam: any) => {
  return User.find({});
};