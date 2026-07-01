/**
 * @file ExerciseGoalRouter.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as middleware from "@middlewares/exercise/ExerciseGoalMiddleware";
import * as service from "@services/exercise/ExerciseGoalService";
import express, { Request, Response, type Router } from "express";
export const router: Router = express.Router();

// 0. exist ----------------------------------------------------------------------------------------
router.get(`/exist`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.exist(
      req.query.user_id as string,
      req.query.DATE as any,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `searchSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    } else if (finalResult.status === `fail`) {
      res.json({
        msg: `searchFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    } else {
      res.json({
        msg: `searchError`,
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

// 1. list -----------------------------------------------------------------------------------------
router.get(`/list`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.list(
      req.query.user_id as string,
      req.query.DATE as any,
      req.query.PAGING as any,
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
      msg: error instanceof Error ? error.message : String(error),
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// 2. detail ---------------------------------------------------------------------------------------
router.get(`/detail`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.detail(
      req.query.user_id as string,
      req.query.DATE as any,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `searchSuccessful`,
        status: finalResult.status,
        sectionCnt: finalResult.sectionCnt,
        result: finalResult.result,
      });
    } else if (finalResult.status === `fail`) {
      res.json({
        msg: `searchFailed`,
        status: finalResult.status,
        sectionCnt: finalResult.sectionCnt,
        result: finalResult.result,
      });
    } else {
      res.json({
        msg: `searchError`,
        status: finalResult.status,
        sectionCnt: finalResult.sectionCnt,
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

// 3. create ---------------------------------------------------------------------------------------
router.post(`/create`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.create(
      req.body.user_id as string,
      req.body.OBJECT,
      req.body.DATE,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `createSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    } else if (finalResult.status === `fail`) {
      res.json({
        msg: `createFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    } else {
      res.json({
        msg: `createError`,
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

// 4. update ---------------------------------------------------------------------------------------
router.put(`/update`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.update(
      req.body.user_id as string,
      req.body.OBJECT,
      req.body.DATE,
      req.body.type as string,
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

// 5. delete --------------------------------------------------------------------------------------
router.delete(`/delete`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.deletes(
      req.body.user_id as string,
      req.body.DATE,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `deleteSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    } else if (finalResult.status === `fail`) {
      res.json({
        msg: `deleteFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    } else {
      res.json({
        msg: `deleteError`,
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
