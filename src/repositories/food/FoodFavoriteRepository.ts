/**
 * @file FoodFavoriteRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { User } from "@schemas/user/User";

// 1. list -------------------------------------------------------------------------------
export const list = async (user_id_param: string) => {
  const finalResult: Record<string, any> | null = await User.findOne(
    {
      user_id: user_id_param,
    },
    {
      _id: 0,
      user_favorite: 1,
    },
  ).lean();

  return (finalResult?.user_favorite ?? []).map(
    ({ _id: _drop, ...rest }: any) => rest,
  );
};

// 4. update -----------------------------------------------------------------------------
export const update = async (
  user_id_param: string,
  foodFavorite_param: any,
) => {
  const finalResult: any = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        user_favorite: foodFavorite_param,
      },
    },
    {
      upsert: true,
      returnDocument: `after`,
    },
  ).lean();

  return finalResult.user_favorite;
};
