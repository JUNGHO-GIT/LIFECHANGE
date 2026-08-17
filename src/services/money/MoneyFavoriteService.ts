/**
 * @file MoneyFavoriteService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { list as listFavorite, update as updateFavorite } from "@repositories/money/MoneyFavoriteRepository";

// 1. 목록 조회 ------------------------------------------------------------------
export const list = async (user_id_param: string) => {
  const findResult: any[] = await listFavorite(user_id_param);
  const finalResult: any[] = (Array.isArray(findResult) ? findResult : []).map(
    (item: any, index: number) => ({
      ...item,
      money_record_query: `favorite`,
      money_record_perNumber: index + 1,
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
  user_id_param: string,
  favorite_param: any,
) => {
  const favoriteKey: string = String(favorite_param?.money_record_key ?? ``);

  // 필수 키 부재 시 저장 차단 (잘못된 바디가 upsert로 유입되는 것 방지)
  if (favoriteKey === ``) {
    return {
      status: `fail`,
      result: null,
    };
  }

  const findResult: any[] = await listFavorite(user_id_param);
  const favoriteList: any[] = Array.isArray(findResult) ? findResult : [];
  const existFavorite: boolean = favoriteList.some((item: any) => (
    item?.money_record_key === favoriteKey
  ));
  const nextFavorite: any[] = existFavorite
    ? favoriteList.filter((item: any) => item?.money_record_key !== favoriteKey)
    : [ ...favoriteList, favorite_param ];
  const updateResult: any[] = await updateFavorite(
    user_id_param,
    nextFavorite,
  );

  return {
    status: `success`,
    result: updateResult,
  };
};
