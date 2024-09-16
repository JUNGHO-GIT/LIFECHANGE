// foodMiddleware.ts

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  const makeNonValueColor = (param: string) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  object?.result?.forEach((item: any) => {
    Object.assign(item, {
      food_total_kcal_color: makeNonValueColor(
        item?.food_total_kcal
      ),
      food_total_carb_color: makeNonValueColor(
        item?.food_total_carb
      ),
      food_total_protein_color: makeNonValueColor(
        item?.food_total_protein
      ),
      food_total_fat_color: makeNonValueColor(
        item?.food_total_fat
      ),
    });
  });

  return object;
};

// 3. create ---------------------------------------------------------------------------------------
export const create = async (object: any) => {

  let totalKcal = 0;
  let totalCarb = 0;
  let totalProtein = 0;
  let totalFat = 0;

  object?.food_section?.map((item: any) => {
    totalKcal += parseFloat(item?.food_kcal);
    totalCarb += parseFloat(item?.food_carb);
    totalProtein += parseFloat(item?.food_protein);
    totalFat += parseFloat(item?.food_fat);
  });

  object.food_total_kcal = String(totalKcal);
  object.food_total_carb = String(totalCarb);
  object.food_total_protein = String(totalProtein);
  object.food_total_fat = String(totalFat);

  return object;
};

// 5. replace --------------------------------------------------------------------------------------
export const replace = async (object: any) => {

  let totalKcal = 0;
  let totalCarb = 0;
  let totalProtein = 0;
  let totalFat = 0;

  object?.food_section?.map((item: any) => {
    totalKcal += parseFloat(item?.food_kcal);
    totalCarb += parseFloat(item?.food_carb);
    totalProtein += parseFloat(item?.food_protein);
    totalFat += parseFloat(item?.food_fat);
  });

  object.food_total_kcal = String(totalKcal);
  object.food_total_carb = String(totalCarb);
  object.food_total_protein = String(totalProtein);
  object.food_total_fat = String(totalFat);

  return object;
};

// 6. delete --------------------------------------------------------------------------------------
export const deletes = async (object: any) => {

  let totalKcal = 0;
  let totalCarb = 0;
  let totalProtein = 0;
  let totalFat = 0;

  object?.food_section?.map((item: any) => {
    totalKcal += parseFloat(item?.food_kcal);
    totalCarb += parseFloat(item?.food_carb);
    totalProtein += parseFloat(item?.food_protein);
    totalFat += parseFloat(item?.food_fat);
  });

  object.food_total_kcal = String(totalKcal);
  object.food_total_carb = String(totalCarb);
  object.food_total_protein = String(totalProtein);
  object.food_total_fat = String(totalFat);

  return object;
};