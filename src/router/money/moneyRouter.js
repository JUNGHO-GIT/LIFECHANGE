// router.js

import express from "express";
import * as service from "../../service/money/moneyService.js";
import * as middleware from "../../middleware/money/moneyMiddleware.js";
export const router = express.Router();

// 0. exist ----------------------------------------------------------------------------------------
router.get("/exist", async (req, res) => {
  try {
    let result = await service.exist (
      req.query.user_id,
      req.query.DATE
    );
    if (result) {
      res.json({
        status: "success",
        msg: "searchSuccessful",
        result: result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "searchFailed",
        result: null,
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

// 1-1. list ---------------------------------------------------------------------------------------
router.get("/list", async (req, res) => {
  try {
    let result = await service.list (
      req.query.user_id,
      req.query.PAGING,
      req.query.DATE
    );
    result = await middleware.list(result);
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "searchSuccessful",
        totalCnt: result.totalCnt,
        result: result.result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "searchFailed",
        totalCnt: 0,
        result: null,
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
      req.query.user_id,
      req.query._id,
      req.query.DATE
    );
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "searchSuccessful",
        sectionCnt: result.sectionCnt,
        result: result.result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "searchFailed",
        sectionCnt: 0,
        result: null,
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

// 3. save -----------------------------------------------------------------------------------------
router.post("/save", async (req, res) => {
  try {
    let result = await service.save(
      req.body.user_id,
      req.body.OBJECT,
      req.body.DATE
    );
    result = await middleware.save(result);
    if (result) {
      res.json({
        status: "success",
        msg: "saveSuccessful",
        result: result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "saveFailed",
        result: null,
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
router.post("/deletes", async (req, res) => {
  try {
    let result = await service.deletes(
      req.body.user_id,
      req.body._id,
      req.body.DATE
    );
    result = await middleware.deletes(result);
    if (result) {
      res.json({
        status: "success",
        msg: "deleteSuccessful",
        result: result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "deleteFailed",
        result: null,
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