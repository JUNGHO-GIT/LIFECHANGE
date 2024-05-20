// userPercentRouter.js

import express from "express";
import * as service from "../../service/user/userPercentService.js";
import * as middleware from "../../middleware/user/userPercentMiddleware.js";
export const router = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
router.get("/list", async (req, res) => {
  try {
    let result = await service.list (
      req.query.user_id,
      req.query.DATE
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

// 2. property ------------------------------------------------------------------------------------>
router.get("/property", async (req, res) => {
  try {
    let result = await service.property (
      req.query.user_id
    );
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