// userPlanRouter.js

import express from "express";
import * as service from "../../service/user/userPlanService.js";
export const router = express.Router();

// 1-2. list -------------------------------------------------------------------------------------->
router.get("/list/plan", async (req, res) => {
  try {
    let result = await service.list (
      req.query.user_id,
      req.query.PAGING,
      req.query.PART,
    );
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        totalCnt: result.totalCnt,
        result: result.result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패",
        result: null
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