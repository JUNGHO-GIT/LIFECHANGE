// userRouter.js

import express from "express";
import * as service from "../../service/user/userService.js";
export const router = express.Router();

// 0-0. signup ------------------------------------------------------------------------------------>
router.post("/signup", async (req, res) => {
  try {
    let result = await service.signup (
      req.body.user_id,
      req.body.user_pw
    );
    if (result && result !== "duplicated") {
      res.json({
        status: "success",
        msg: "회원가입 성공",
        result: result
      });
    }
    else if (result === "duplicated") {
      res.json({
        status: "duplicated",
        msg: "아이디 중복"
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
router.post("/login", async (req, res) => {
  try {
    let result = await service.login (
      req.body.user_id,
      req.body.user_pw
    );
    if (result && result !== "fail") {
      res.json({
        status: "success",
        msg: "로그인 성공",
        result: result
      });
    }
    else if (result === "fail") {
      res.json({
        status: "fail",
        msg: "아이디 또는 비밀번호가 일치하지 않습니다."
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

// 2. detail -------------------------------------------------------------------------------------->
router.get("/detail", async (req, res) => {
  try {
    let result = await service.detail (
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

// 3-1. add --------------------------------------------------------------------------------------->
router.post("/add", async (req, res) => {
  try {
    let result = await service.add (
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

// 3-2. save -------------------------------------------------------------------------------------->
router.post("/save", async (req, res) => {
  try {
    let result = await service.save (
      req.body.user_id,
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

// 4. deletes ------------------------------------------------------------------------------------->
router.delete("/deletes", async (req, res) => {
  try {
    let result = await service.deletes(
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