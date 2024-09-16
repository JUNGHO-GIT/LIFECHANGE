// exerciseMiddleware.ts

import { strToDecimal, decimalToStr } from "@scripts/utils";

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  const makeNonValueColor = (param: string) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  object?.result?.forEach((item: any) => {
    Object.assign(item, {
      exercise_total_volume_color: makeNonValueColor(
        item?.exercise_total_volume
      ),
      exercise_total_cardio_color: makeNonValueColor(
        item?.exercise_total_cardio
      ),
      exercise_total_weight_color: makeNonValueColor(
        item?.exercise_total_weight
      ),
    });
  });

  return object;
};

// 3. create ---------------------------------------------------------------------------------------
export const create = async (object: any) => {

  let totalVolume = 0;
  let totalTime = 0.0;

  object?.exercise_section?.map((item: any) => {
    totalVolume += parseFloat(item?.exercise_set) * parseFloat(item?.exercise_rep) * parseFloat(item?.exercise_kg);
    totalTime += strToDecimal(item?.exercise_cardio);
  });

  object.exercise_total_volume = String(totalVolume);
  object.exercise_total_cardio = decimalToStr(totalTime);

  return object;
};

// 4. insert ---------------------------------------------------------------------------------------
export const insert = async (object: any) => {

  let totalVolume = 0;
  let totalTime = 0.0;

  object?.exercise_section?.map((item: any) => {
    totalVolume += parseFloat(item?.exercise_set) * parseFloat(item?.exercise_rep) * parseFloat(item?.exercise_kg);
    totalTime += strToDecimal(item?.exercise_cardio);
  });

  object.exercise_total_volume = String(totalVolume);
  object.exercise_total_cardio = decimalToStr(totalTime);

  return object;
};

// 5. replace --------------------------------------------------------------------------------------
export const replace = async (object: any) => {

  let totalVolume = 0;
  let totalTime = 0.0;

  object?.exercise_section?.map((item: any) => {
    totalVolume += parseFloat(item?.exercise_set) * parseFloat(item?.exercise_rep) * parseFloat(item?.exercise_kg);
    totalTime += strToDecimal(item?.exercise_cardio);
  });

  object.exercise_total_volume = String(totalVolume);
  object.exercise_total_cardio = decimalToStr(totalTime);

  return object;
};

// 6. delete --------------------------------------------------------------------------------------
export const deletes = async (object: any) => {

  let totalVolume = 0;
  let totalTime = 0.0;

  object?.exercise_section?.map((item: any) => {
    totalVolume += parseFloat(item?.exercise_set) * parseFloat(item?.exercise_rep) * parseFloat(item?.exercise_kg);
    totalTime += strToDecimal(item?.exercise_cardio);
  });

  object.exercise_total_volume = String(totalVolume);
  object.exercise_total_cardio = decimalToStr(totalTime);

  return object;
};