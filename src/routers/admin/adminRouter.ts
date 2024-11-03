// router.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/admin/adminService";
export const router = express.Router();

// 0. curEnv ---------------------------------------------------------------------------------------
router.get("/curEnv", async (_req: Request, res: Response) => {
  try {
    let finalResult = await service.curEnv();
    if (finalResult.status === "success") {
      res.json({
        msg: "searchSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "searchFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "searchError",
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

// 1. appInfo --------------------------------------------------------------------------------------
router.get("/appInfo", async (_req: Request, res: Response) => {
  try {
    let finalResult = await service.appInfo();
    if (finalResult.status === "success") {
      res.json({
        msg: "searchSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "searchFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "searchError",
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

// 2. userCount ------------------------------------------------------------------------------------
router.get("/userCount", async (_req: Request, res: Response) => {
  try {
    let finalResult = await service.userCount (
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "searchSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "searchFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "searchError",
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
