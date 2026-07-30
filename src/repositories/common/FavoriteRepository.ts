/**
 * @file FavoriteRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { User } from "@schemas/user/User";

export type FavoriteKind = `exercise` | `money` | `sleep`;

const favoriteFields: Record<FavoriteKind, string> = {
  exercise: `user_exercise_favorite`,
  money: `user_money_favorite`,
  sleep: `user_sleep_favorite`,
};

// 1. 목록 조회 ------------------------------------------------------------------
export const list = async (
  kind_param: FavoriteKind,
  user_id_param: string,
) => {
  const favoriteField: string = favoriteFields[kind_param];
  const finalResult: Record<string, any> | null = await User.findOne(
    {
      user_id: user_id_param,
    },
    {
      _id: 0,
      [favoriteField]: 1,
    },
  ).lean();

  return (finalResult?.[favoriteField] ?? []).map(
    ({ _id: _drop, ...rest }: any) => rest,
  );
};

// 2. 목록 갱신 ------------------------------------------------------------------
export const update = async (
  kind_param: FavoriteKind,
  user_id_param: string,
  favorite_param: any[],
) => {
  const favoriteField: string = favoriteFields[kind_param];
  const finalResult: Record<string, any> | null = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        [favoriteField]: favorite_param,
      },
    },
    {
      upsert: true,
      returnDocument: `after`,
    },
  ).lean();

  return finalResult?.[favoriteField] ?? [];
};
