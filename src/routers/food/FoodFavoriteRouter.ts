// foodFavoriteRouter.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/food/FoodFavoriteService";
import * as middleware from "@middlewares/food/FoodFavoriteMiddleware";
export const router = express.Router();

// 1. list -------------------------------------------------------------------------------
router.get("/list", async (req: Request, res: Response) => {
	try {
		let finalResult = await service.list (
			req.query.user_id as string,
		);
		finalResult = await middleware.list(finalResult);
		if (finalResult.status === "success") {
			res.json({
				msg: "searchSuccessful",
				status: finalResult.status,
				totalCnt: finalResult.totalCnt,
				result: finalResult.result,
			});
		}
		else if (finalResult.status === "fail") {
			res.json({
				msg: "searchFailed",
				status: finalResult.status,
				totalCnt: finalResult.totalCnt,
				result: finalResult.result,
			});
		}
		else {
			res.json({
				msg: "searchError",
				status: finalResult.status,
				totalCnt: finalResult.totalCnt,
				result: finalResult.result,
			});
		}
	}
	catch (err: any) {
		console.error(err);
		res.status(500).json({
			status: "error",
			msg: err.toString(),
			error: err.toString(),
		});
	}
});

// 4. update -----------------------------------------------------------------------------
router.put("/update", async (req: Request, res: Response) => {
	try {
		let finalResult = await service.update(
			req.body.user_id as string,
			req.body.foodFavorite as any,
		);
		if (finalResult.status === "success") {
			res.json({
				msg: "updateSuccessful",
				status: finalResult.status,
				result: finalResult.result,
			});
		}
		else if (finalResult.status === "fail") {
			res.json({
				msg: "updateFailed",
				status: finalResult.status,
				result: finalResult.result,
			});
		}
		else {
			res.json({
				msg: "updateError",
				status: finalResult.status,
				result: finalResult.result,
			});
		}
	}
	catch (err: any) {
		console.error(err);
		res.status(500).json({
			status: "error",
			msg: err.toString(),
			error: err.toString(),
		});
	}
});