// foodFavoriteRepository.ts

import { User } from "@schemas/user/User";

// 1. list -------------------------------------------------------------------------------
export const list = async (
	user_id_param: string,
) => {

	const finalResult: any = await User.aggregate([
		{
			$match: {
				user_id: user_id_param,
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

// 4. update -----------------------------------------------------------------------------
export const update = async (
	user_id_param: string,
	foodFavorite_param: any,
) => {

	const finalResult:any = await User.findOneAndUpdate(
		{
			user_id: user_id_param
		},
		{
			$set: {
				user_favorite: foodFavorite_param
			}
		},
		{
			upsert: true,
			new: true
		}
	)
	.lean();

	return finalResult.user_favorite;
};