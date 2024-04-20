// userMiddleware.js

// 1. percent ------------------------------------------------------------------------------------->
export const percent = async (object) => {

  if (!object) {
    return [];
  }

  console.log(JSON.stringify(object, null, 3));

  return object;
};