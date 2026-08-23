/**
 * @file MoneyFavoriteRouter.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { list as listFavorite, update as updateFavorite } from "@services/money/MoneyFavoriteService";
import express, { type Request, type Response, type Router } from "express";
export const router: Router = express.Router();

// 1. list -------------------------------------------------------------------------------
router.get(`/list`, async (req: Request, res: Response) => {
  try {
    const finalResult = await listFavorite(
      req.query.user_id as string,
    );
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
      msg: `serverError`,
      result: null,
    });
  }
});

// 2. update -----------------------------------------------------------------------------
router.put(`/update`, async (req: Request, res: Response) => {
  try {
    const finalResult = await updateFavorite(
      req.body.user_id as string,
      req.body.favorite,
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
      msg: `serverError`,
      result: null,
    });
  }
});
