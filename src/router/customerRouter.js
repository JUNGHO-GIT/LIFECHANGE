// customerRouter.js

import express from "express";
import * as service from "../service/customerService.js";
export const router = express.Router();

// 0-0. signup ------------------------------------------------------------------------------------>
router.post("/signup", async (req, res) => {
  try {
    let result = await service.signup (
      req.body.customer_id,
      req.body.customer_pw
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
router.post("/login", async (req, res) => {
  try {
    let result = await service.login (
      req.body.customer_id,
      req.body.customer_pw
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
router.post("/checkId", async (req, res) => {
  try {
    let result = await service.checkId (
      req.body.customer_id
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
      req.query.customer_id
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

// 4. deletes ------------------------------------------------------------------------------------->
router.delete("/delete", async (req, res) => {
  try {
    let result = await service.deletes(
      req.query._id,
      req.query.customer_id
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