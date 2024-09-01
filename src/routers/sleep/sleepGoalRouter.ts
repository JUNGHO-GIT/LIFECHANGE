// router.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/sleep/sleepGoalService";
import * as middleware from "@middlewares/sleep/sleepGoalMiddleware";
export const router = express.Router();

// 0. exist ----------------------------------------------------------------------------------------
router.get("/exist", async (req: Request, res: Response) => {
  try {
    let result = await service.exist (
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
    );
    if (result) {
      res.json({
        status: "success",
        msg: "searchSuccessful",
        result: result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "searchFailed",
        result: null,
      });
    }
  }
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 1-1. list ---------------------------------------------------------------------------------------
router.get("/list", async (req: Request, res: Response) => {
  try {
    let result = await service.list(
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
      req.query.PAGING as Record<string, any>,
    );
    result = await middleware.list(result);
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "searchSuccessful",
        totalCnt: result.totalCnt,
        result: result.result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "searchFailed",
        totalCnt: 0,
        result: null,
      });
    }
  }
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
router.get("/detail", async (req: Request, res: Response) => {
  try {
    let result = await service.detail (
      req.query.user_id as string,
      req.query._id as string,
      req.query.DATE as Record<string, any>,
    );
    if (result) {
      res.json({
        status: "success",
        msg: "searchSuccessful",
        sectionCnt: result.sectionCnt,
        result: result.result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "searchFailed",
        sectionCnt: 0,
        result: null,
      });
    }
  }
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 3. save -----------------------------------------------------------------------------------------
router.post("/save", async (req: Request, res: Response) => {
  try {
    let result = await service.save(
      req.body.user_id as string,
      req.body.OBJECT as Record<string, any>,
      req.body.DATE as Record<string, any>,
    );
    if (result) {
      res.json({
        status: "success",
        msg: "saveSuccessful",
        result: result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "saveFailed",
        result: null,
      });
    }
  }
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 4. deletes --------------------------------------------------------------------------------------
router.post("/deletes", async (req: Request, res: Response) => {
  try {
    let result = await service.deletes(
      req.body.user_id as string,
      req.body._id as string,
      req.body.DATE as Record<string, any>,
    );
    if (result) {
      res.json({
        status: "success",
        msg: "deleteSuccessful",
        result: result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "deleteFailed",
        result: null,
      });
    }
  }
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});