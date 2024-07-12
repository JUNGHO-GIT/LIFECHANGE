// userDataRouter.js

import express from "express";
import * as service from "../../service/user/userDataService.js";
export const router = express.Router();

// 1-1. category -----------------------------------------------------------------------------------
router.get("/category", async (req, res) => {
  try {
    let result = await service.category (
      req.query.user_id
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

// 1-2. list ---------------------------------------------------------------------------------------
router.get("/list", async (req, res) => {
  try {
    let result = await service.list (
      req.query.user_id,
      req.query.PAGING,
      req.query.PART
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
        totalCnt: 0,
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

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
router.get("/detail", async (req, res) => {
  try {
    let result = await service.detail (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        result: result
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

// 3-1. save ---------------------------------------------------------------------------------------
router.post("/save", async (req, res) => {
  try {
    let result = await service.save (
      req.body.user_id,
      req.body.PART,
      req.body.count
    );
    if (result) {
      res.json({
        status: "success",
        msg: "추가 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "추가 실패",
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

// 4. deletes --------------------------------------------------------------------------------------
router.delete("/deletes", async (req, res) => {
  try {
    let result = await service.deletes (
      req.body.user_id,
      req.body.PART,
    );
    if (result) {
      res.json({
        status: "success",
        msg: "삭제 성공"
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "삭제 실패"
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