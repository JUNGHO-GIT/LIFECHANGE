/**
 * @file UserRouter.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import express from "express";
import { type Router, Request, Response } from "express";
import { requireAuth } from "@middlewares/auth/AuthMiddleware";
import * as service from "@services/user/UserService";
export const router: Router = express.Router();

// 1-1. sendEmail ----------------------------------------------------------------------------------
router.post(`/email/send`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.sendEmailCode(
      req.body.user_id as string,
      req.body.type as string,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `emailSendSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `emailSendFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `duplicate`) {
      res.json({
        msg: `duplicatedEmail`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `isGoogle`) {
      res.json({
        msg: `isGoogleUserResetPw`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `notExist`) {
      res.json({
        msg: `emailNotExist`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `emailSendError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 1-2. verifyEmail --------------------------------------------------------------------------------
router.post(`/email/verify`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.verifyEmail(
      req.body.user_id as string,
      req.body.verify_code as string,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `authenticationSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `authenticationFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `authenticationError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 2-1. userSignup ---------------------------------------------------------------------------------
router.post(`/signup`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userSignup(
      req.body.user_id as string,
      req.body.OBJECT,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `signupSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `signupFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `duplicated`) {
      res.json({
        msg: `duplicatedEmail`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    // 이메일 인증 티켓 부재·만료·재사용 (interceptor 가 401·403 을 강제 로그아웃으로 처리하므로 200 유지)
    else if (finalResult.status === `notVerified`) {
      res.json({
        msg: `authenticationFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `signupError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 2-2. userResetPw --------------------------------------------------------------------------------
router.post(`/resetPw`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userResetPw(
      req.body.user_id as string,
      req.body.OBJECT,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `resetPwSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `resetPwFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `isGoogle`) {
      res.json({
        msg: `isGoogleUserResetPw`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `notExist`) {
      res.json({
        msg: `emailNotExist`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    // 이메일 인증 티켓 부재·만료·재사용 (interceptor 가 401·403 을 강제 로그아웃으로 처리하므로 200 유지)
    else if (finalResult.status === `notVerified`) {
      res.json({
        msg: `authenticationFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `resetPwError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 2-3. userLogin ----------------------------------------------------------------------------------
// - 성공 시 액세스 토큰을 함께 반환하며, 클라이언트는 이후 요청에 Bearer 로 첨부함
router.post(`/login`, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userLogin(
      req.body.user_id as string,
      req.body.user_pw as string,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `loginSuccessful`,
        status: finalResult.status,
        admin: finalResult.admin,
        token: finalResult.token,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `pwDoesNotMatch`) {
      res.json({
        msg: `pwDoesNotMatch`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `theIdOrPwIsIncorrect`,
        status: finalResult.status,
        admin: finalResult.admin,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `isGoogle`) {
      res.json({
        msg: `isGoogleUserLogin`,
        status: finalResult.status,
        admin: finalResult.admin,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `loginError`,
        status: finalResult.status,
        admin: finalResult.admin,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 2-4. userSession --------------------------------------------------------------------------------
// - 저장된 토큰으로 세션을 복원하는 자동로그인 경로 (평문 비밀번호 보관 대체)
router.get(`/session`, requireAuth, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userSession(
      req.query.user_id as string,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `loginSuccessful`,
        status: finalResult.status,
        admin: finalResult.admin,
        result: finalResult.result,
      });
    }
    else {
      res.status(401).json({
        msg: `unauthorized`,
        status: finalResult.status,
        admin: finalResult.admin,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 2-4-1. userLogout ------------------------------------------------------------------------------
// - 토큼 세대를 갱싱해 보관된 자동로그인 토큼까지 함께 무효화함
router.post(`/logout`, requireAuth, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userLogout(
      req.body.user_id as string,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `logoutSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `logoutFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 2-5. userDetail ---------------------------------------------------------------------------------
router.get(`/detail`, requireAuth, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userDetail(
      req.query.user_id as string,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `searchSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `searchFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `searchError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 2-6. userUpdate ---------------------------------------------------------------------------------
router.put(`/update`, requireAuth, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userUpdate(
      req.body.user_id as string,
      req.body.OBJECT,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `updateSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `updateFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `updateError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 2-7. userDelete --------------------------------------------------------------------------------
router.delete(`/delete`, requireAuth, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.userDelete(
      req.body.user_id as string,
      req.body.user_pw as string,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `deleteSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `pwDoesNotMatch`) {
      res.json({
        msg: `pwDoesNotMatch`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `deleteFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `deleteError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 3-1. categoryDetail -----------------------------------------------------------------------------
router.get(`/category/detail`, requireAuth, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.categoryDetail(
      req.query.user_id as string,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `searchSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `searchFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `searchError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});

// 3-2. categoryUpdate -----------------------------------------------------------------------------
router.post(`/category/update`, requireAuth, async (req: Request, res: Response) => {
  try {
    let finalResult = await service.categoryUpdate(
      req.body.user_id as string,
      req.body.OBJECT,
    );
    if (finalResult.status === `success`) {
      res.json({
        msg: `saveSuccessful`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else if (finalResult.status === `fail`) {
      res.json({
        msg: `saveFailed`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
    else {
      res.json({
        msg: `saveError`,
        status: finalResult.status,
        result: finalResult.result,
      });
    }
  }
  catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      status: `error`,
      msg: `serverError`,
      result: null,
    });
  }
});
