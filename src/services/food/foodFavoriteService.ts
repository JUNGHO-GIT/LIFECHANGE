// foodFavoriteService.ts

import * as repository from "@repositories/food/foodFavoriteRepository";

// 1. list -------------------------------------------------------------------------------
export const list = async (
	user_id_param: string,
) => {

	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let totalCntResult: any = null;
	let statusResult: string = "";

	findResult = await repository.list(
		user_id_param
	);
	totalCntResult = findResult?.length;

	if (!findResult) {
		finalResult = [];
		statusResult = "fail";
	}
	else {
		finalResult = findResult;
		statusResult = "success";
	}

	finalResult = finalResult.map((item: any, index: number) => ({
		...item,
		food_record_query: "favorite",
		food_record_perNumber: index + 1,
		food_record_part: "breakfast",
	}));

	return {
		status: statusResult,
		totalCnt: totalCntResult,
		result: finalResult,
	};
};

// 4. update -----------------------------------------------------------------------------
export const update = async (
	user_id_param: string,
	foodFavorite_param: any,
) => {

	// result 변수 선언
	let findResult: any = null;
	let updateResult: any = null;
	let finalResult: any = null;
	let statusResult: string = "";

	const foodKey = foodFavorite_param.food_record_key;

	findResult = await repository.list(
		user_id_param
	);

	const existFavorite = findResult.some((item: any) => (
		item.food_record_key === foodKey
	));

	if (existFavorite) {
		foodFavorite_param = findResult?.filter((item: any) => (
			item.food_record_key !== foodKey
		));
	}
	else {
		foodFavorite_param = [
			...findResult,
			foodFavorite_param
		];
	}

	updateResult = await repository.update(
		user_id_param, foodFavorite_param
	);

	if (!updateResult) {
		finalResult = null;
		statusResult = "fail";
	}
	else {
		finalResult = updateResult;
		statusResult = "success";
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};