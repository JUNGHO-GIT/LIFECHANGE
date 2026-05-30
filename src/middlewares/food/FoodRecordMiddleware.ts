/**
 * @file FoodRecordMiddleware.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const list = async (object: any) => {
	// 0. calcOverTenMillion ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const clcOvrTnMlln = (param: string) => {
		let finalResult: string = ``;

		if (
			!param ||
			param === `0` ||
			param === `00:00` ||
			String(param).includes(`:`)
		) {
			finalResult = param;
		}
		// 12300000 -> 1.23M / 10000000 -> 10M
		else if (Number(param) >= 10_000_000) {
			finalResult = `${Number.parseFloat((Number(param) / 1_000_000).toFixed(2)).toString()}M`;
		} else {
			finalResult = Number.parseFloat(Number(param).toFixed(2)).toString();
		}

		return finalResult;
	};

	// 0. calcNonValueColor ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const clcNnValClr = (param: string) => {
		let finalResult: string = ``;

		if (!param) {
			finalResult = param;
		} else if (param === `0` || param === `00:00`) {
			finalResult = `grey`;
		} else {
			finalResult = `light-black`;
		}

		return finalResult;
	};

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	object?.result?.forEach((item: any) => {
		item.food_record_total_kcal = clcOvrTnMlln(
			item?.food_record_total_kcal,
		);
		item.food_record_total_carb = clcOvrTnMlln(
			item?.food_record_total_carb,
		);
		item.food_record_total_protein = clcOvrTnMlln(
			item?.food_record_total_protein,
		);
		item.food_record_total_fat = clcOvrTnMlln(
			item?.food_record_total_fat,
		);

		item.food_record_total_kcal_color = clcNnValClr(
			item?.food_record_total_kcal,
		);
		item.food_record_total_carb_color = clcNnValClr(
			item?.food_record_total_carb,
		);
		item.food_record_total_protein_color = clcNnValClr(
			item?.food_record_total_protein,
		);
		item.food_record_total_fat_color = clcNnValClr(
			item?.food_record_total_fat,
		);
	});

	return object;
};
