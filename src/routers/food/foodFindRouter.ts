// foodFindRouter.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/food/foodFindService";
import * as middleware from "@middlewares/food/foodFindMiddleware";
export const router = express.Router();

// 0. list -----------------------------------------------------------------------------------------
router.get("/list", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.list (
      req.query.PAGING as any,
      req.query.isoCode as string,
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