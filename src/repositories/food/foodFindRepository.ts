// foodFindRepository.ts

import { User } from "@schemas/user/User";

// 1-2. listFavorite -------------------------------------------------------------------------------
export const listFavorite = async (
  user_id_param: string,
) => {

  const finalResult: any = await User.aggregate([
    {
      $match: {
        user_id: user_id_param,
      },
    },
    {
      $project: {
        _id: 0,
        "user_foodFavorite._id": 0,
      },
    },
  ]);

  return finalResult[0].user_foodFavorite;
};

// 4-2. updateFavorite -----------------------------------------------------------------------------
export const updateFavorite = async (
  user_id_param: string,
  foodFavorite_param: any,
) => {

  const finalResult:any = await User.findOneAndUpdate(
    {
      user_id: user_id_param
    },
    {
      $set: {
        user_foodFavorite: foodFavorite_param
      }
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult.user_foodFavorite;
};