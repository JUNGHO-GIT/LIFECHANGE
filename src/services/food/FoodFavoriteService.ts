/**
 * @file FoodFavoriteService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/food/FoodFavoriteRepository";

// 1. list ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const list = async (
  usrIdPrm: string,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let ttlCntRes: any = null;
  let statusResult: string = ``;

  findResult = await repository.list(
    usrIdPrm,
  );
  ttlCntRes = findResult?.length;

  if (!findResult) {
    finalResult = [];
    statusResult = `fail`;
  }
  else {
    finalResult = findResult;
    statusResult = `success`;
  }

  finalResult = finalResult.map((item: any, index: number) => ({
    ...item,
    food_record_query: `favorite`,
    food_record_perNumber: index + 1,
    food_record_part: `breakfast`,
  }));

  return {
    status: statusResult,
    totalCnt: ttlCntRes,
    result: finalResult,
  };
};

// 4. update ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const update = async (
  usrIdPrm: string,
  fdFavPrm: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let updateResult: any = null;
  let finalResult: any = null;
  let statusResult: string = ``;

  const foodKey: string = fdFavPrm.food_record_key;

  findResult = await repository.list(
    usrIdPrm,
  );

  const exstFav = findResult.some((item: any) => (
    item.food_record_key === foodKey
  ));

  fdFavPrm = exstFav ? findResult?.filter((item: any) => (
    item.food_record_key !== foodKey
  )) : [
    ...findResult,
    fdFavPrm,
  ];

  updateResult = await repository.update(
    usrIdPrm, fdFavPrm,
  );

  if (!updateResult) {
    finalResult = null;
    statusResult = `fail`;
  }
  else {
    finalResult = updateResult;
    statusResult = `success`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};
