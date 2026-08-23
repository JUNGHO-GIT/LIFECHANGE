/**
 * @file FoodRecordChartRouter.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as service from "@services/food/FoodRecordChartService";
import express, { Request, Response, type Router } from "express";
export const router: Router = express.Router();

// 1-1. chart (bar - today) ------------------------------------------------------------------------
router.get(`/bar`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.bar(
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
      msg: `serverError`,
      result: null,
    });
  }
});

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
      msg: `serverError`,
      result: null,
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
      msg: `serverError`,
      result: null,
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
      msg: `serverError`,
      result: null,
    });
  }
});

// 3-1. chart (line - week) ------------------------------------------------------------------------
router.get(`/line/week`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.lineWeek(
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
      msg: `serverError`,
      result: null,
    });
  }
});

// 3-2. chart (line - month) -----------------------------------------------------------------------
router.get(`/line/month`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.lineMonth(
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
      msg: `serverError`,
      result: null,
    });
  }
});

// 4-1. chart (avg - week) -------------------------------------------------------------------------
router.get(`/avg/week`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.avgWeek(
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
      msg: `serverError`,
      result: null,
    });
  }
});

// 4-2. chart (avg - month) ------------------------------------------------------------------------
router.get(`/avg/month`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.avgMonth(
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
      msg: `serverError`,
      result: null,
    });
  }
});
