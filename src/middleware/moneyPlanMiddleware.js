// moneyMiddleware.js

import {strToDecimal, decimalToStr} from "../assets/common/date.js";

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {

  console.log("==========================================================");
  console.log(JSON.stringify(object));

  if (object === "deleted") {
    return {};
  }
  else {
    return object;
  }
};