// userRouter.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/user/userService";
export const router = express.Router();

// 0-1. appInfo -----------------------------------------------------------------------------------
router.get("/app/info", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.appInfo();
    if (finalResult.status === "success") {
      res.json({
        msg: "searchSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "searchFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "searchError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 1-1. sendEmail ----------------------------------------------------------------------------------
router.post("/email/send", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.sendEmail (
      req.body.user_id as string,
      req.body.type as string,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "emailSendSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "emailSendFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "duplicate") {
      res.json({
        msg: "duplicatedEmail",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "isGoogle") {
      res.json({
        msg: "isGoogleUserResetPw",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "notExist") {
      res.json({
        msg: "emailNotExist",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "emailSendError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 1-2. verifyEmail --------------------------------------------------------------------------------
router.post("/email/verify", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.verifyEmail (
      req.body.user_id as string,
      req.body.verify_code as string,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "authenticationSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "authenticationFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "authenticationError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 2-1. userSignup ---------------------------------------------------------------------------------
router.post("/signup", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userSignup (
      req.body.user_id as string,
      req.body.OBJECT as Record<string, any>,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "signupSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "signupFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "duplicated") {
      res.json({
        msg: "duplicatedId",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "signupError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 2-2. userResetPw --------------------------------------------------------------------------------
router.post("/resetPw", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userResetPw (
      req.body.user_id as string,
      req.body.OBJECT as Record<string, any>,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "resetPwSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "resetPwFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "isGoogle") {
      res.json({
        msg: "isGoogleUserResetPw",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "notExist") {
      res.json({
        msg: "emailNotExist",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "resetPwError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 2-3. userLogin ----------------------------------------------------------------------------------
router.post("/login", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userLogin (
      req.body.user_id as string,
      req.body.user_pw as string,
      req.body.isAutoLogin as boolean,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "loginSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "loginFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "isGoogle") {
      res.json({
        msg: "isGoogleUserLogin",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "loginError",
        status: finalResult.status,
        result: finalResult.result,
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
    let finalResult = await service.userDetail (
      req.query.user_id as string,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "searchSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "searchFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "searchError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 2-5. userUpdate ---------------------------------------------------------------------------------
router.post("/update", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userUpdate (
      req.body.user_id as string,
      req.body.OBJECT as Record<string, any>,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "updateSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "updateFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "updateError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 2-6. userDeletes --------------------------------------------------------------------------------
router.delete("/deletes", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userDeletes (
      req.body.user_id as string,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "deleteSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "deleteFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "deleteError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 3-1. categoryList -------------------------------------------------------------------------------
router.get("/category/list", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.categoryList (
      req.query.user_id as string,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "searchSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "searchFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "searchError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 3-2. categorySave -------------------------------------------------------------------------------
router.post("/category/save", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.categorySave (
      req.body.user_id as string,
      req.body.OBJECT as Record<string, any>,
      req.body.DATE as Record<string, any>,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "saveSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "saveFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "saveError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 4-1. dummyList ----------------------------------------------------------------------------------
router.get("/dummyList", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.dummyList (
      req.query.user_id as string,
      req.query.PAGING as Record<string, any>,
      req.query.PART as string,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "searchSuccessful",
        status: finalResult.status,
        totalCnt: finalResult.totalCnt,
        result: finalResult.result
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "searchFailed",
        status: finalResult.status,
        totalCnt: finalResult.totalCnt,
        result: finalResult.result
      });
    }
    else {
      res.json({
        msg: "searchError",
        status: finalResult.status,
        totalCnt: finalResult.totalCnt,
        result: finalResult.result
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 4-2. dummySave ----------------------------------------------------------------------------------
router.post("/dummySave", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.dummySave (
      req.body.user_id as string,
      req.body.PART as string,
      req.body.count as number,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "saveSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "saveFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "saveError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});

// 4-3. dummyDeletes -------------------------------------------------------------------------------
router.delete("/dummyDeletes", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.dummyDeletes (
      req.body.user_id as string,
      req.body.PART as string,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "deleteSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "deleteFailed",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "deleteError",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (err: any) {
    console.error(err);
    res.status(500).json({
      status: "error",
      msg: err.toString(),
      error: err.toString(),
    });
  }
});