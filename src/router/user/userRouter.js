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

// 1-1. sendEmail ----------------------------------------------------------------------------------
router.post("/email/send", async (req, res) => {
  try {
    let result = await service.sendEmail (
      req.body.user_id,
      req.body.type,
    );
    if (result.result === "success") {
      res.json({
        status: "success",
        msg: "emailSendSuccessful",
        result: result,
      });
    }
    else if (result.result === "duplicate") {
      res.json({
        status: "duplicate",
        msg: "duplicateEmail",
        result: null,
      });
    }
    else if (result.result === "notExist") {
      res.json({
        status: "notExist",
        msg: "emailNotExist",
        result: null,
      });
    }
    else if (result.result === "fail") {
      res.json({
        status: "fail",
        msg: "emailSendFailed",
        result: null,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "emailSendFailed",
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
        msg: "authenticationSuccessful",
        result: result,
      });
    }
    else if (result === "fail") {
      res.json({
        status: "fail",
        msg: "authenticationFailed",
        result: null,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "authenticationFailed",
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
        msg: "signupSuccessful",
        result: result,
      });
    }
    else if (result === "duplicated") {
      res.json({
        status: "duplicated",
        msg: "duplicatedId",
        result: null,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "signupFailed",
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

// 2-2. userResetPw --------------------------------------------------------------------------------
router.post("/resetPw", async (req, res) => {
  try {
    let result = await service.userResetPw (
      req.body.user_id,
      req.body.OBJECT
    );
    if (result) {
      res.json({
        status: "success",
        msg: "pwResetSuccessful",
        result: result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "pwResetFailed",
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

// 2-3. userLogin ----------------------------------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    let result = await service.userLogin (
      req.body.user_id,
      req.body.user_pw
    );
    if (result.result && result.result !== "fail") {
      res.json({
        status: "success",
        msg: "loginSuccessful",
        admin: result.admin,
        result: result.result,
      });
    }
    else if (result.result === "fail") {
      res.json({
        status: "fail",
        msg: "theIdOrPwIsIncorrect",
        result: null,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "loginFailed",
        result: null,
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: "loginFailed",
      result: null,
      error: err.toString()
    });
  }
});

// 2-4. userDetail ---------------------------------------------------------------------------------
router.get("/detail", async (req, res) => {
  try {
    let result = await service.userDetail (
      req.query.user_id
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

// 2-5. userUpdate ---------------------------------------------------------------------------------
router.post("/update", async (req, res) => {
  try {
    let result = await service.userUpdate (
      req.body.user_id,
      req.body.OBJECT
    );
    if (result) {
      res.json({
        status: "success",
        msg: "UpdateSuccessful",
        result: result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "UpdateFailed",
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

// 2-6. userDeletes --------------------------------------------------------------------------------
router.delete("/deletes", async (req, res) => {
  try {
    let result = await service.userDeletes (
      req.body.user_id
    );
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

// 3-1. categoryList -------------------------------------------------------------------------------
router.get("/category/list", async (req, res) => {
  try {
    let result = await service.categoryList (
      req.query.user_id
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