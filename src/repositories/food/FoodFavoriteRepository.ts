/**
 * @file FoodFavoriteRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { User } from "@schemas/user/User";

// 1. list ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const list = async (usrIdPrm: string) => {
	const finalResult: any = await User.aggregate([
		{
			$match: {
				user_id: usrIdPrm,
			},
		},
		{
			$project: {
				_id: 0,
				"user_favorite._id": 0,
			},
		},
	]);

	return finalResult[0]?.user_favorite;
};

// 4. update ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const update = async (
	usrIdPrm: string,
	fdFavPrm: any,
) => {
	const finalResult: any = await User.findOneAndUpdate(
		{
			user_id: usrIdPrm,
		},
		{
			$set: {
				user_favorite: fdFavPrm,
			},
		},
		{
			upsert: true,
			new: true,
		},
	).lean();

	return finalResult.user_favorite;
};
