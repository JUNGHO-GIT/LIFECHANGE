// calendarMiddleware.js

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (object) => {

  if (!object) {
    return [];
  }

  return object;
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {
  if (object === "deleted") {
    return {};
  }
  return object;
};