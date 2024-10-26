// userSyncRouter.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/user/userSyncService";
import * as middleware from "@middlewares/user/userSyncMiddleware";
export const router = express.Router();

// 0. category (카테고리 조회) ---------------------------------------------------------------------
router.get("/category", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.category(
      req.query.user_id as string
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

// 1. percent (퍼센트 조회) ------------------------------------------------------------------------
router.get("/percent", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.percent(
      req.query.user_id as string,
      req.query.DATE as any,
    );
    finalResult = await middleware.percent(finalResult);
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

// 2. scale (체중 조회) ----------------------------------------------------------------------------
router.get("/scale", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.scale (
      req.query.user_id as string,
      req.query.DATE as any,
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

// 3-1. nutrition (영양정보 조회) ------------------------------------------------------------------
router.get("/nutrition", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.nutrition (
      req.query.user_id as string,
      req.query.DATE as any,
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

// 3-2. favorite (즐겨찾기 조회) -------------------------------------------------------------------
router.get("/favorite", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.favorite (
      req.query.user_id as string,
      req.query.DATE as any,
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

// 4. property (자산 조회) -------------------------------------------------------------------------
router.get("/property", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.property (
      req.query.user_id as string,
      req.query.DATE as any,
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