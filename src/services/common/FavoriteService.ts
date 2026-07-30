/**
 * @file FavoriteService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { list as listFavorite, update as updateFavorite } from "@repositories/common/FavoriteRepository";
import type { FavoriteKind } from "@repositories/common/FavoriteRepository";

const favoriteKeyNames: Record<FavoriteKind, string> = {
  exercise: `exercise_record_key`,
  money: `money_record_key`,
  sleep: `sleep_record_key`,
};

// 1. 목록 조회 ------------------------------------------------------------------
export const list = async (
  kind_param: FavoriteKind,
  user_id_param: string,
) => {
  const findResult: any[] = await listFavorite(kind_param, user_id_param);
  const finalResult: any[] = (Array.isArray(findResult) ? findResult : []).map(
    (item: any, index: number) => ({
      ...item,
      [`${kind_param}_record_query`]: `favorite`,
      [`${kind_param}_record_perNumber`]: index + 1,
    }),
  );

  return {
    status: `success`,
    totalCnt: finalResult.length,
    result: finalResult,
  };
};

// 2. 목록 갱신 ------------------------------------------------------------------
export const update = async (
  kind_param: FavoriteKind,
  user_id_param: string,
  favorite_param: any,
) => {
  const favoriteKeyName: string = favoriteKeyNames[kind_param];
  const favoriteKey: string = String(favorite_param?.[favoriteKeyName] ?? ``);
  const findResult: any[] = await listFavorite(kind_param, user_id_param);
  const favoriteList: any[] = Array.isArray(findResult) ? findResult : [];
  const existFavorite: boolean = favoriteList.some((item: any) => (
    item?.[favoriteKeyName] === favoriteKey
  ));
  const nextFavorite: any[] = existFavorite
    ? favoriteList.filter((item: any) => item?.[favoriteKeyName] !== favoriteKey)
    : [ ...favoriteList, favorite_param ];
  const updateResult: any[] = await updateFavorite(
    kind_param,
    user_id_param,
    nextFavorite,
  );

  return {
    status: `success`,
    result: updateResult,
  };
};
