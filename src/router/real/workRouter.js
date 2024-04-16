// workRouter.js

import express from "express";
import * as service from "../../service/real/workService.js";
export const workRouter = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
workRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.work_dur,
      req.query.FILTER,
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
        msg: "조회 실패"
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

// 2. detail -------------------------------------------------------------------------------------->
workRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id,
      req.query.user_id,
      req.query.work_dur
    );
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        sectionCnt: result.sectionCnt,
        result: result.result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패"
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
workRouter.post("/save", async (req, res) => {
  try {
    const result = await service.save (
      req.body.user_id,
      req.body.WORK,
      req.body.work_dur
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
        msg: "저장 실패"
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

// 4. deletes ------------------------------------------------------------------------------------->
workRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes(
      req.query._id,
      req.query.user_id,
      req.query.work_dur
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