// exerciseMiddleware.js

import {strToDecimal, decimalToStr} from "../../assets/js/date.js";

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {

  if (object === "deleted") {
    return {};
  }

  let totalVolume = 0;
  let totalTime = 0.0;

  object?.exercise_section?.map((item) => {
    totalVolume += item?.exercise_set * item?.exercise_rep * item?.exercise_kg;
    totalTime += strToDecimal(item?.exercise_cardio);
  });

  object.exercise_total_volume = totalVolume;
  object.exercise_total_cardio = decimalToStr(totalTime);

  return object;
};
// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (object) => {

  if (object === "deleted") {
    return {};
  }

  let totalVolume = 0;
  let totalTime = 0.0;

  object?.exercise_section?.map((item) => {
    totalVolume += item?.exercise_set * item?.exercise_rep * item?.exercise_kg;
    totalTime += strToDecimal(item?.exercise_cardio);
  });

  object.exercise_total_volume = totalVolume;
  object.exercise_total_cardio = decimalToStr(totalTime);

  return object;
};