/**
 * @file MoneyFavoriteRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { User } from "@schemas/user/User";

// 1. 목록 조회 ------------------------------------------------------------------
export const list = async (user_id_param: string) => {
  const finalResult: Record<string, any> | null = await User.findOne(
    {
      user_id: user_id_param,
    },
    {
      _id: 0,
      user_money_favorite: 1,
    },
  ).lean();

  return (finalResult?.user_money_favorite ?? []).map(
    ({ _id: _drop, ...rest }: any) => rest,
  );
};

// 2. 목록 갱신 ------------------------------------------------------------------
export const update = async (
  user_id_param: string,
  favorite_param: any[],
) => {
  const finalResult: Record<string, any> | null = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        user_money_favorite: favorite_param,
      },
    },
    {
      upsert: true,
      returnDocument: `after`,
    },
  ).lean();

  return finalResult?.user_money_favorite ?? [];
};
