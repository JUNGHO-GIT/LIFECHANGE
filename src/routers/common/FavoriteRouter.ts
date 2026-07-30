/**
 * @file FavoriteRouter.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { list as listFavorite, update as updateFavorite } from "@services/common/FavoriteService";
import type { FavoriteKind } from "@repositories/common/FavoriteRepository";
import express, { type Request, type Response, type Router } from "express";

// 1. 라우터 생성 ----------------------------------------------------------------
export const createFavoriteRouter = (kind_param: FavoriteKind): Router => {
  const router: Router = express.Router();

  router.get(`/list`, async (req: Request, res: Response) => {
    try {
      const finalResult = await listFavorite(
        kind_param,
        req.query.user_id as string,
      );
      res.json({
        msg: `searchSuccessful`,
        status: finalResult.status,
        totalCnt: finalResult.totalCnt,
        result: finalResult.result,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({
        status: `error`,
        msg: error instanceof Error ? error.message : String(error),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  router.put(`/update`, async (req: Request, res: Response) => {
    try {
      const finalResult = await updateFavorite(
        kind_param,
        req.body.user_id as string,
        req.body.favorite,
      );
      res.json({
        msg: `updateSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({
        status: `error`,
        msg: error instanceof Error ? error.message : String(error),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return router;
};
