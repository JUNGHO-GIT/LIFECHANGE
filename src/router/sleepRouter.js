// sleepRouter.js

import express from "express";
import * as service from "../service/sleepService.js";
export const sleepRouter = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
sleepRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.duration,
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
sleepRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id,
      req.query.user_id,
      req.query.duration
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
sleepRouter.post("/save", async (req, res) => {
  try {
    const result = await service.save (
      req.body.user_id,
      req.body.OBJECT,
      req.body.duration
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
sleepRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes(
      req.query._id,
      req.query.section_id,
      req.query.user_id,
      req.query.duration
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