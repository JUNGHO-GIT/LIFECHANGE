// workMiddleware.js

import {strToDecimal, decimalToStr} from "../assets/common/date.js";

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {

  let totalVolume = 0;
  let totalTime = 0.0;

  await Promise.all(object?.work_section?.map(async (item) => {
    totalVolume += item.work_set * item.work_rep * item.work_kg;
    totalTime += strToDecimal(item.work_cardio);
  }));

  object.work_total_volume = totalVolume;
  object.work_total_time = decimalToStr(totalTime);

  return object;
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (req, res, next) => {
  return next();
};