// exerciseMiddleware.js

import {strToDecimal, decimalToStr} from "../../assets/js/utils.js";

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