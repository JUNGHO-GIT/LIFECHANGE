// exerciseMiddleware.js

import { strToDecimal, decimalToStr } from "../../assets/js/utils.js";

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object) => {

  if (!object) {
    return [];
  }

  const makeNonValueColor = (param) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  object?.result?.map((item) => {
    Object.assign((item), {
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

// 3. save -----------------------------------------------------------------------------------------
export const save = async (object) => {

  if (object === "deleted") {
    return {};
  }

  let totalVolume = 0;
  let totalTime = 0.0;

  object?.exercise_section?.map((item) => {
    totalVolume += parseFloat(item?.exercise_set) * parseFloat(item?.exercise_rep) * parseFloat(item?.exercise_kg);
    totalTime += strToDecimal(item?.exercise_cardio);
  });

  object.exercise_total_volume = String(totalVolume);
  object.exercise_total_cardio = decimalToStr(totalTime);

  return object;
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (object) => {

  if (object === "deleted") {
    return {};
  }

  let totalVolume = 0;
  let totalTime = 0.0;

  object?.exercise_section?.map((item) => {
    totalVolume += parseFloat(item?.exercise_set) * parseFloat(item?.exercise_rep) * parseFloat(item?.exercise_kg);
    totalTime += strToDecimal(item?.exercise_cardio);
  });

  object.exercise_total_volume = String(totalVolume);
  object.exercise_total_cardio = decimalToStr(totalTime);

  return object;
};