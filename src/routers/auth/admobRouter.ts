// admobRouter.ts

import express from "express";
import { Request, Response } from "express";
export const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

// 4. app-ads.txt ----------------------------------------------------------------------------------
router.get("/", async (req: Request, res: Response) => {
  try {
    res.sendFile("app-ads.txt", { root: "./src/assets/auth/" });
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