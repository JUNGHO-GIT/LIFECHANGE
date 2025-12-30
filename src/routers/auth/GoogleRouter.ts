/**
 * @file GoogleRouter.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-14
 */

import express from "express";
import { type Router, Request, Response } from "express";
import * as service from "@services/auth/GoogleService";
export const router: Router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

// 1. login ----------------------------------------------------------------------------------------
router.get(`/login`, async (_req: Request, res: Response) => {
  try {
    const finalResult = await service.login();

    // Google 로그인 페이지로 리디렉트 url 리턴
    if (finalResult.status === `success`) {
      res.json({
        msg: `authenticationUrlGeneratedSuccessfully`,
        status: finalResult.status,
        url: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `authenticationUrlGenerationFailed`,
        status: finalResult.status,
        url: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `authenticationUrlGenerationError`,
        status: finalResult.status,
        url: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: error as string,
      error: error as string,
    });
  }
});

// 2. callback -------------------------------------------------------------------------------------
router.get(`/callback`, async (req: Request, res: Response) => {
  try {
    const finalResult = await service.callback(
      req.query.code as string,
    );
    if (finalResult.status === `success`) {
      res.redirect(finalResult.result);
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `callbackFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `callbackError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: error as string,
      error: error as string,
    });
  }
});

// 3. afterCallback --------------------------------------------------------------------------------
router.get(`/afterCallback`, async (_req: Request, res: Response) => {
  try {
    const finalResult = await service.afterCallback();
    if (finalResult.status === `success`) {
      res.json({
        msg: `googleLoginSuccessful`,
        status: finalResult.status,
        admin: finalResult.admin,
        googleId: finalResult.googleId,
        googlePw: finalResult.googlePw,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `googleLoginFailed`,
        status: finalResult.status,
        admin: finalResult.admin,
        googleId: finalResult.googleId,
        googlePw: finalResult.googlePw,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `googleLoginError`,
        status: finalResult.status,
        admin: finalResult.admin,
        googleId: finalResult.googleId,
        googlePw: finalResult.googlePw,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: error as string,
      error: error as string,
    });
  }
});
