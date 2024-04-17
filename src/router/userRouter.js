// userRouter.js

import express from "express";
import * as service from "../service/userService.js";
export const userRouter = express.Router();

// 0-0. signup ------------------------------------------------------------------------------------>
userRouter.post("/signup", async (req, res) => {
  try {
    const result = await service.signup (
      req.body.user_id,
      req.body.user_pw
    );
    if (result) {
      res.json({
        status: "success",
        msg: "회원가입 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "회원가입 실패"
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

// 0-1. login ------------------------------------------------------------------------------------->
userRouter.post("/login", async (req, res) => {
  try {
    const result = await service.login (
      req.body.user_id,
      req.body.user_pw
    );
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "로그인 성공",
        result: result.result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "로그인 실패"
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

// 0-2. checkId ----------------------------------------------------------------------------------->
userRouter.post("/checkId", async (req, res) => {
  try {
    const result = await service.checkId (
      req.body.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "아이디 중복 확인 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "아이디 중복 확인 실패"
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

// 1-1. dataset ----------------------------------------------------------------------------------->
userRouter.get("/dataset", async (req, res) => {
  try {
    const result = await service.dataset (
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
userRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.sort,
      req.query.limit,
      req.query.page
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
userRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id,
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
userRouter.post("/save", async (req, res) => {
  try {
    const result = await service.save (
      req.body.user_id,
      req.body.USER
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
userRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes(
      req.query._id,
      req.query.user_id
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