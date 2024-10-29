// ImportScripts.tsx

import { sync } from "@assets/scripts/sync";
import { getLocal, setLocal, getSession, setSession } from "@assets/scripts/storage";
import { makeForm, insertComma, handleY } from "@assets/scripts/utils";
import { randomNumber, randomTime, calcDate } from "@assets/scripts/utils";
import { strToDecimal, decimalToStr } from "@assets/scripts/utils";

// -------------------------------------------------------------------------------------------------
export {
  handleY,
  sync,
  makeForm,
  insertComma,
  getLocal,
  setLocal,
  getSession,
  setSession,
  randomNumber,
  randomTime,
  calcDate,
  strToDecimal,
  decimalToStr,
};