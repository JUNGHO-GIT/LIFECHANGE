// userRouter.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/user/UserService";
export const router = express.Router();

// 1-1. sendEmail ----------------------------------------------------------------------------------
router.post("/email/send", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.sendEmailCode (
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
      req.body.OBJECT as any,
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
        msg: "duplicatedEmail",
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
      req.body.OBJECT as any,
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
        admin: finalResult.admin,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "pwDoesNotMatch") {
      res.json({
        msg: "pwDoesNotMatch",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "fail") {
      res.json({
        msg: "theIdOrPwIsIncorrect",
        status: finalResult.status,
        admin: finalResult.admin,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "isGoogle") {
      res.json({
        msg: "isGoogleUserLogin",
        status: finalResult.status,
        admin: finalResult.admin,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: "loginError",
        status: finalResult.status,
        admin: finalResult.admin,
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
router.put("/update", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userUpdate (
      req.body.user_id as string,
      req.body.OBJECT as any,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "updateSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "pwDoesNotMatch") {
      res.json({
        msg: "pwDoesNotMatch",
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

// 2-6. userDelete --------------------------------------------------------------------------------
router.delete("/delete", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userDelete (
      req.body.user_id as string,
      req.body.user_pw as string,
    );
    if (finalResult.status === "success") {
      res.json({
        msg: "deleteSuccessful",
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === "pwDoesNotMatch") {
      res.json({
        msg: "pwDoesNotMatch",
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

// 3-2. categoryDetail -----------------------------------------------------------------------------
router.get("/category/detail", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.categoryDetail (
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

// 3-2. categoryUpdate -----------------------------------------------------------------------------
router.post("/category/update", async (req: Request, res: Response) => {
  try {
    let finalResult = await service.categoryUpdate (
      req.body.user_id as string,
      req.body.OBJECT as any,
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