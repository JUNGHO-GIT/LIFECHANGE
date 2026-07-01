/**
 * @file FoodFavoriteRouter.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as middleware from "@middlewares/food/FoodFavoriteMiddleware";
import * as service from "@services/food/FoodFavoriteService";
import express, { Request, Response, type Router } from "express";
export const router: Router = express.Router();

// 1. list -------------------------------------------------------------------------------
router.get(`/list`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.list(req.query.user_id as string);
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
      msg: error instanceof Error ? error.message : String(error),
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// 4. update -----------------------------------------------------------------------------
router.put(`/update`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.update(
      req.body.user_id as string,
      req.body.foodFavorite,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `updateSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    } else if (finalResult.status === `fail`) {
      res.json({
        msg: `updateFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    } else {
      res.json({
        msg: `updateError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: error instanceof Error ? error.message : String(error),
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
