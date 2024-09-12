// exerciseRouter.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/exercise/exerciseService";
import * as middleware from "@middlewares/exercise/exerciseMiddleware";
export const router = express.Router();

// 0. exist ----------------------------------------------------------------------------------------
router.get("/exist", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.exist (
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

// 1-1. list ---------------------------------------------------------------------------------------
router.get("/list", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.list (
      req.query.user_id as string,
      req.query.DATE as any,
      req.query.PAGING as any,
    );
    finalResult = await middleware.list(finalResult);
    if (finalResult.status === "success") {
      res.json({
        msg: "searchSuccessful",
        status: finalResult.status,
        totalCnt: finalResult.totalCnt,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "searchFailed",
        status: finalResult.status,
        totalCnt: finalResult.totalCnt,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "searchError",
        status: finalResult.status,
        totalCnt: finalResult.totalCnt,
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

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
router.get("/detail", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.detail (
      req.query.user_id as string,
      req.query._id as string,
      req.query.DATE as any,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "searchSuccessful",
        status: finalResult.status,
        sectionCnt: finalResult.sectionCnt,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "searchFailed",
        status: finalResult.status,
        sectionCnt: finalResult.sectionCnt,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "searchError",
        status: finalResult.status,
        sectionCnt: finalResult.sectionCnt,
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

// 3. save -----------------------------------------------------------------------------------------
router.post("/save", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.save(
      req.body.user_id as string,
      req.body.OBJECT as any,
      req.body.DATE as any,
    );
    finalResult = await middleware.save(finalResult);
    if (finalResult.status === "success") {
      res.json({
        msg: "saveSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "saveFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "saveError",
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

// 4. update ---------------------------------------------------------------------------------------
router.put("/update", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.update(
      req.body.user_id as string,
      req.body._id as string,
      req.body.OBJECT as any,
      req.body.DATE as any,
    );
    finalResult = await middleware.update(finalResult);
    if (finalResult.status === "success") {
      res.json({
        msg: "updateSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "updateFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "updateError",
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

// 5. delete --------------------------------------------------------------------------------------
router.delete("/delete", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.deletes(
      req.body.user_id as string,
      req.body._id as string,
      req.body.DATE as any,
    );
    finalResult = await middleware.deletes(finalResult);
    if (finalResult.status === "success") {
      res.json({
        msg: "deleteSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "deleteFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "deleteError",
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