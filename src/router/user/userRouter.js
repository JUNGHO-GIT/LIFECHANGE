// userRouter.js

import express from "express";
import * as service from "../../service/user/userService.js";
export const router = express.Router();

// 0-1. appInfo -----------------------------------------------------------------------------------
router.get("/app/info", async (req, res) => {
  try {
    let result = await service.appInfo (
    );
    if (result) {
      res.json({
        status: "success",
        msg: "앱정보 조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "앱정보 조회 실패"
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

// 1-1. sendEmail ----------------------------------------------------------------------------------
router.post("/email/send", async (req, res) => {
  try {
    let result = await service.sendEmail (
      req.body.user_id
    );
    if (result.result === "success") {
      res.json({
        status: "success",
        msg: "이메일 전송 성공",
        result: result
      });
    }
    else if (result.result === "fail") {
      res.json({
        status: "fail",
        msg: "이메일 전송 실패"
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "이메일 전송 실패"
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

// 1-2. verifyEmail --------------------------------------------------------------------------------
router.post("/email/verify", async (req, res) => {
  try {
    let result = await service.verifyEmail (
      req.body.user_id,
      req.body.verify_code
    );
    if (result === "success") {
      res.json({
        status: "success",
        msg: "인증 성공"
      });
    }
    else if (result === "fail") {
      res.json({
        status: "fail",
        msg: "인증 실패"
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "인증 실패"
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

// 2-1. userSignup ---------------------------------------------------------------------------------
router.post("/signup", async (req, res) => {
  try {
    let result = await service.userSignup (
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

// 2-2. userLogin ----------------------------------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    let result = await service.userLogin (
      req.body.user_id,
      req.body.user_pw
    );
    if (result.result && result.result !== "fail") {
      res.json({
        status: "success",
        msg: "로그인 성공",
        admin: result.admin,
        result: result.result
      });
    }
    else if (result.result === "fail") {
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

// 2-3. userDetail ---------------------------------------------------------------------------------
router.get("/detail", async (req, res) => {
  try {
    let result = await service.userDetail (
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

// 2-4. userUpdate ---------------------------------------------------------------------------------
router.post("/update", async (req, res) => {
  try {
    let result = await service.userUpdate (
      req.body.user_id,
      req.body.OBJECT
    );
    if (result) {
      res.json({
        status: "success",
        msg: "수정 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "수정 실패",
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

// 2-3. userDeletes --------------------------------------------------------------------------------
router.delete("/deletes", async (req, res) => {
  try {
    let result = await service.userDeletes (
      req.body.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "탈퇴 성공"
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "탈퇴 실패"
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

// 3-1. categoryList -------------------------------------------------------------------------------
router.get("/category/list", async (req, res) => {
  try {
    let result = await service.categoryList (
      req.query.user_id
    );
    if (result) {
      res.json({
        status: "success",
        msg: "카테고리 조회 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "카테고리 조회 실패"
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

// 3-2. categorySave -------------------------------------------------------------------------------
router.post("/category/save", async (req, res) => {
  try {
    let result = await service.categorySave (
      req.body.user_id,
      req.body.OBJECT
    );
    if (result) {
      res.json({
        status: "success",
        msg: "카테고리 저장 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "카테고리 저장 실패"
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

// 4-1. dummyList ----------------------------------------------------------------------------------
router.get("/dummyList", async (req, res) => {
  try {
    let result = await service.dummyList (
      req.query.user_id,
      req.query.PAGING,
      req.query.PART
    );
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "더미데이터 조회 성공",
        totalCnt: result.totalCnt,
        result: result.result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "더미데이터 조회 실패",
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

// 4-2. dummySave ----------------------------------------------------------------------------------
router.post("/dummySave", async (req, res) => {
  try {
    let result = await service.dummySave (
      req.body.user_id,
      req.body.PART,
      req.body.count
    );
    if (result) {
      res.json({
        status: "success",
        msg: "더미데이터 추가 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "더미데이터 추가 실패",
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

// 4-3. dummyDeletes -------------------------------------------------------------------------------
router.delete("/dummyDeletes", async (req, res) => {
  try {
    let result = await service.dummyDeletes (
      req.body.user_id,
      req.body.PART,
    );
    if (result) {
      res.json({
        status: "success",
        msg: "더미데이터 삭제 성공"
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "더미데이터 삭제 실패"
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