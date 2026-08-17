/**
 * @file MoneyGoalChartRouter.ts
 * @description money goal chart routes
 * @author Jungho
 * @since 2026-08-17
 */

import * as service from "@services/money/MoneyGoalChartService";
import express, { Request, Response, type Router } from "express";
export const router: Router = express.Router();

// 2-2. chart (pie - week) -------------------------------------------------------------------------
router.get(`/pie/week`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.pieWeek(
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

// 2-3. chart (pie - month) ------------------------------------------------------------------------
router.get(`/pie/month`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.pieMonth(
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

// 2-4. chart (pie - year) -------------------------------------------------------------------------
router.get(`/pie/year`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.pieYear(
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
