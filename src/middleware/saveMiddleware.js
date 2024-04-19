// saveMiddleware.js

import * as service from "../service/workService.js";

// ------------------------------------------------------------------------------------------------>
export const save = async (req, res, next) => {
  await  console.log("saveMiddleware====================================================================A");
  await  console.log(JSON.stringify(req.body));

  return next();
}