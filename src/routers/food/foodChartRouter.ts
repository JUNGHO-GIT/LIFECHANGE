// router.ts

import express from "express";
import { Request, Response } from "express";
import * as service from "@services/food/foodChartService";
export const router = express.Router();

// 1-1. chart (bar - today) ------------------------------------------------------------------------
router.get("/bar/today", async (req: Request, res: Response) => {
  try {
    let result = await service.barToday (
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
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

// 2-1. chart (pie - today) ------------------------------------------------------------------------
router.get("/pie/today", async (req: Request, res: Response) => {
  try {
    let result = await service.pieToday (
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
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

// 2-2. chart (pie - week) -------------------------------------------------------------------------
router.get("/pie/week", async (req: Request, res: Response) => {
  try {
    let result = await service.pieWeek (
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
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

// 2-3. chart (pie - month) ------------------------------------------------------------------------
router.get("/pie/month", async (req: Request, res: Response) => {
  try {
    let result = await service.pieMonth (
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
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

// 3-1. chart (line - week) ------------------------------------------------------------------------
router.get("/line/week", async (req: Request, res: Response) => {
  try {
    let result = await service.lineWeek (
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
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

// 3-2. chart (line - month) -----------------------------------------------------------------------
router.get("/line/month", async (req: Request, res: Response) => {
  try {
    let result = await service.lineMonth (
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
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

// 4-1. chart (avg - week) -------------------------------------------------------------------------
router.get("/avg/week", async (req: Request, res: Response) => {
  try {
    let result = await service.avgWeek (
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
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

// 4-2. chart (avg - month) ------------------------------------------------------------------------
router.get("/avg/month", async (req: Request, res: Response) => {
  try {
    let result = await service.avgMonth (
      req.query.user_id as string,
      req.query.DATE as Record<string, any>,
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