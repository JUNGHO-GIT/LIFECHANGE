// userRouter.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/user/userService";
export const router = express.Router();

// 0-1. appInfo -----------------------------------------------------------------------------------
router.get("/app/info", async (req: Request, res: Response) => {
  try {
    let result = await service.appInfo();
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 1-1. sendEmail ----------------------------------------------------------------------------------
router.post("/email/send", async (req: Request, res: Response) => {
  try {
    let result = await service.sendEmail (
      req.body.user_id as string,
      req.body.type as string,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 1-2. verifyEmail --------------------------------------------------------------------------------
router.post("/email/verify", async (req: Request, res: Response) => {
  try {
    let result = await service.verifyEmail (
      req.body.user_id as string,
      req.body.verify_code as string,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 2-1. userSignup ---------------------------------------------------------------------------------
router.post("/signup", async (req: Request, res: Response) => {
  try {
    let result = await service.userSignup (
      req.body.user_id as string,
      req.body.OBJECT as Record<string, any>,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 2-2. userResetPw --------------------------------------------------------------------------------
router.post("/resetPw", async (req: Request, res: Response) => {
  try {
    let result = await service.userResetPw (
      req.body.user_id as string,
      req.body.OBJECT as Record<string, any>,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 2-3. userLogin ----------------------------------------------------------------------------------
router.post("/login", async (req: Request, res: Response) => {
  try {
    let result = await service.userLogin (
      req.body.user_id as string,
      req.body.user_pw as string,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      msg: "loginFailed",
      result: null,
      error: err
    });
  }
});

// 2-4. userDetail ---------------------------------------------------------------------------------
router.get("/detail", async (req: Request, res: Response) => {
  try {
    let result = await service.userDetail (
      req.query.user_id as string,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 2-5. userUpdate ---------------------------------------------------------------------------------
router.post("/update", async (req: Request, res: Response) => {
  try {
    let result = await service.userUpdate (
      req.body.user_id as string,
      req.body.OBJECT as Record<string, any>,
    );
    if (result) {
      res.json({
        status: "success",
        msg: "updateSuccessful",
        result: result,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "updateFailed",
        result: null,
      });
    }
  }
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 2-6. userDeletes --------------------------------------------------------------------------------
router.delete("/deletes", async (req: Request, res: Response) => {
  try {
    let result = await service.userDeletes (
      req.body.user_id as string,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 3-1. categoryList -------------------------------------------------------------------------------
router.get("/category/list", async (req: Request, res: Response) => {
  try {
    let result = await service.categoryList (
      req.query.user_id as string,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 3-2. categorySave -------------------------------------------------------------------------------
router.post("/category/save", async (req: Request, res: Response) => {
  try {
    let result = await service.categorySave (
      req.body.user_id as string,
      req.body.OBJECT as Record<string, any>,
      req.body.DATE as Record<string, any>,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 4-1. dummyList ----------------------------------------------------------------------------------
router.get("/dummyList", async (req: Request, res: Response) => {
  try {
    let result = await service.dummyList (
      req.query.user_id as string,
      req.query.PAGING as Record<string, any>,
      req.query.PART as string,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 4-2. dummySave ----------------------------------------------------------------------------------
router.post("/dummySave", async (req: Request, res: Response) => {
  try {
    let result = await service.dummySave (
      req.body.user_id as string,
      req.body.PART as string,
      req.body.count as number,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});

// 4-3. dummyDeletes -------------------------------------------------------------------------------
router.delete("/dummyDeletes", async (req: Request, res: Response) => {
  try {
    let result = await service.dummyDeletes (
      req.body.user_id as string,
      req.body.PART as string,
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
  catch (err: any) {
    res.status(500).json({
      status: "error",
      error: err
    });
  }
});