// router.js

import express from "express";
import * as service from "../service/tweakService.js";
export const router = express.Router();

// 1-1. dataset ----------------------------------------------------------------------------------->
router.get("/dataset", async (req, res) => {
  try {
    let result = await service.dataset (
      req.query.customer_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "데이터셋 조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "데이터셋 조회 실패"
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

// 1-2. list -------------------------------------------------------------------------------------->
router.get("/list", async (req, res) => {
  try {
    let result = await service.list (
      req.query.customer_id,
      req.query.PAGING
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

// 3. save ---------------------------------------------------------------------------------------->
router.post("/save", async (req, res) => {
  try {
    let result = await service.save (
      req.body.customer_id,
      req.body.OBJECT
    );
    if (result) {
      res.json({
        status: "success",
        msg: "저장 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "저장 실패",
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