/**
 * @file AdminRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { User } from "@schemas/user/User";

// 1. userCount ------------------------------------------------------------------------------------
export const userCount = async (
) => {

	const finalResult: number = await User.countDocuments();

	return finalResult;
};
