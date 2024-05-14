// foodFindRouter.js

import express from "express";
import * as service from "../../service/food/foodFindService.js";
export const router = express.Router();

// 1. find ---------------------------------------------------------------------------------------->
router.get("/find", async (req, res) => {
  try {
    let result = await service.find(
      req.query.user_id,
      req.query.FILTER,
      req.query.PAGING,
      req.query.duration
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