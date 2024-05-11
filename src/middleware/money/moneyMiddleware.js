// moneyMiddleware.js

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {
  if (object === "deleted") {
    return {};
  }
  let totalIn = 0;
  let totalOut = 0;

  object?.money_section?.map((item) => {
    if (item?.money_part_val === "수입") {
      totalIn += item?.money_amount;
    }
    else if (item?.money_part_val === "지출") {
      totalOut += item?.money_amount;
    }
  });

  object.money_total_in = totalIn;
  object.money_total_out = totalOut;

  return object;
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (object) => {
  if (object === "deleted") {
    return {};
  }
  let totalIn = 0;
  let totalOut = 0;

  object?.money_section?.map((item) => {
    if (item?.money_part_val === "수입") {
      totalIn += item?.money_amount;
    }
    else if (item?.money_part_val === "지출") {
      totalOut += item?.money_amount;
    }
  });

  object.money_total_in = totalIn;
  object.money_total_out = totalOut;

  return object;
};