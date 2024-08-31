// exerciseGoalMiddleware.ts

// 3. save -----------------------------------------------------------------------------------------
export const save = async (object: any) => {
  if (object === "deleted") {
    return {};
  }
  return object;
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (object: any) => {
  if (object === "deleted") {
    return {};
  }
  return object;
};