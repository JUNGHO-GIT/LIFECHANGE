// userPlanRouter.js

import express from "express";
import * as service from "../../service/user/userPlanService.js";
import * as middleware from "../../middleware/user/userMiddleware.js";
export const router = express.Router();

// 1-1. percent ----------------------------------------------------------------------------------->
router.get("/percent", async (req, res) => {
  try {
    let result = await service.percent (
      req.query.user_id,
      req.query.duration
    );
    result = await middleware.percent(result);
    if (result) {
      res.json({
        status: "success",
        msg: "성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "실패"
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});