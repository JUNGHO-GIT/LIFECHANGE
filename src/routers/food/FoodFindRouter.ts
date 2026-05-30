/**
 * @file FoodFindRouter.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as middleware from "@middlewares/food/FoodFindMiddleware";
import * as service from "@services/food/FoodFindService";
import express, { type Request, type Response, type Router } from "express";
export const router: Router = express.Router();

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
router.get(`/list`, async (req: Request, res: Response) => {
	try {
		let finalResult = await service.list(
			req.query.PAGING as any,
			req.query.isoCode as string,
		);
		finalResult = await middleware.list(finalResult);
		if (finalResult.status === `success`) {
			res.json({
				msg: `searchSuccessful`,
				status: finalResult.status,
				totalCnt: finalResult.totalCnt,
				result: finalResult.result,
			});
		} else if (finalResult.status === `fail`) {
			res.json({
				msg: `searchFailed`,
				status: finalResult.status,
				totalCnt: finalResult.totalCnt,
				result: finalResult.result,
			});
		} else {
			res.json({
				msg: `searchError`,
				status: finalResult.status,
				totalCnt: finalResult.totalCnt,
				result: finalResult.result,
			});
		}
	} catch (error: unknown) {
		console.error(error);
		res.status(500).json({
			status: `error`,
			msg: error as string,
			error: error as string,
		});
	}
});
