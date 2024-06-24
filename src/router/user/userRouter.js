// userRouter.js

import express from "express";
import * as service from "../../service/user/userService.js";
export const router = express.Router();

// 0-0. info ---------------------------------------------------------------------------------------
router.get("/info", async (req, res) => {
  try {
    let result = await service.info (
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

// 0-0. send ---------------------------------------------------------------------------------------
router.post("/send", async (req, res) => {
  try {
    let result = await service.send (
      req.body.user_id
    );
    if (result.result === "success") {
      res.json({
        status: "success",
        msg: "전송 성공",
        result: result
      });
    }
    else if (result.result === "fail") {
      res.json({
        status: "fail",
        msg: "전송 실패"
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

// 0-0. signup -------------------------------------------------------------------------------------
router.post("/signup", async (req, res) => {
  try {
    let result = await service.signup (
      req.body.user_id,
      req.body.OBJECT
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

// 0-0. exta ---------------------------------------------------------------------------------------
router.post("/extra", async (req, res) => {
  try {
    let result = await service.extra (
      req.body.user_id,
      req.body.OBJECT
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

// 0-1. login --------------------------------------------------------------------------------------
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

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
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

// 3-2. save ---------------------------------------------------------------------------------------
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

// 4. deletes --------------------------------------------------------------------------------------
router.delete("/deletes", async (req, res) => {
  try {
    let result = await service.deletes (
      req.body.user_id
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