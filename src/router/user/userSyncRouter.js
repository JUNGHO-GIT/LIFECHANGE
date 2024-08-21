// userSyncRouter.js

import express from "express";
import * as service from "../../service/user/userSyncService.js";
import * as middleware from "../../middleware/user/userSyncMiddleware.js";
export const router = express.Router();

// 1. percent --------------------------------------------------------------------------------------
router.get("/percent", async (req, res) => {
  try {
    let result = await service.percent(
      req.query.user_id,
      req.query.DATE
    );
    // @ts-ignore
    result = await middleware.percent(result);
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

// 2. property -------------------------------------------------------------------------------------
router.get("/property", async (req, res) => {
  try {
    let result = await service.property (
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

// 3. scale ----------------------------------------------------------------------------------------
router.get("/scale", async (req, res) => {
  try {
    let result = await service.scale (
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