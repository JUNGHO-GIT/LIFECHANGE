// router.js

import express from "express";
import * as service from "../service/tweakService.js";
export const router = express.Router();

// 1-1. dataset ----------------------------------------------------------------------------------->
router.get("/dataset", async (req, res) => {
  try {
    let result = await service.dataset (
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

// 1-2. list -------------------------------------------------------------------------------------->
router.get("/list", async (req, res) => {
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

// 3. save ---------------------------------------------------------------------------------------->
router.post("/save", async (req, res) => {
  try {
    let result = await service.save (
      req.body.user_id,
      req.body.PART,
      req.body.count
    );
    if (result !== "fail") {
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

// 4-2. delete ------------------------------------------------------------------------------------>
router.delete("/delete", async (req, res) => {
  try {
    let result = await service.deletes(
      req.query.user_id,
      req.query.PART
    );
    if (result) {
      res.json({
        status: "success",
        msg: "삭제 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "삭제 실패",
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