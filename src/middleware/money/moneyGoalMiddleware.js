// moneyGoalMiddleware.js

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {
  if (object === "deleted") {
    return {};
  }
  return object;
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (object) => {
  if (object === "deleted") {
    return {};
  }
  return object;
};