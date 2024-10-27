// router.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/admin/adminService";
export const router = express.Router();

// 0. userCount ------------------------------------------------------------------------------------
router.get("/userCount", async (req: Request, res: Response) => {
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
