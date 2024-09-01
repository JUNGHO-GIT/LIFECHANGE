// googleRouter.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/auth/googleService";
export const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

// 1. login ----------------------------------------------------------------------------------------
router.get("/login", async (req: Request, res: Response) => {
  try {
    let result = await service.login();
    if (result) {
      // Google 로그인 페이지로 리디렉트 url 리턴
      res.json({
        status: "success",
        msg: "authenticationUrlGeneratedSuccessfully",
        url: result.url,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "authenticationUrlGenerationFailed",
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

// 2. callback -------------------------------------------------------------------------------------
router.get("/callback", async (req: Request, res: Response) => {
  try {
    let result = await service.callback(
      req.query.code as string,
    );
    if (result.status === "success") {
      res.redirect(result.url);
    }
    else {
      res.json({
        status: "fail",
        msg: "callbackFailed"
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

// 3. afterCallback --------------------------------------------------------------------------------
router.get("/afterCallback", async (req: Request, res: Response) => {
  try {
    let result = await service.afterCallback();
    if (result) {
      res.json({
        status: "success",
        msg: "googleLoginSuccessful",
        result: result.result,
        admin: result.admin,
        googleId: result.googleId,
        googlePw: result.googlePw,
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "googleLoginFailed",
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