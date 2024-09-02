// userSyncRouter.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/user/userSyncService";
import * as middleware from "@middlewares/user/userSyncMiddleware";
export const router = express.Router();

// 1. percent --------------------------------------------------------------------------------------
router.get("/percent", async (req: Request, res: Response) => {
  try {
    let result = await service.percent(
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
    );
    // @ts-ignore
    result = await middleware.percent(result);
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
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 2. property -------------------------------------------------------------------------------------
router.get("/property", async (req: Request, res: Response) => {
  try {
    let result = await service.property (
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
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 3. scale ----------------------------------------------------------------------------------------
router.get("/scale", async (req: Request, res: Response) => {
  try {
    let result = await service.scale (
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
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});