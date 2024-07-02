// basicRouter.js

import fs from "fs";
import express from "express";
import * as service from "../../service/basic/basicService.js";
export const router = express.Router();

// 1. screenShot -----------------------------------------------------------------------------------
router.get("/screenShot", async (req, res) => {
  try {
    let filePath = await service.screenShot(
      req.query.user_id
    );
    if (filePath) {
      // webp 설정
      res.type("webp");
      res.sendFile(filePath, { root: "." }, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({
            status: "error",
            error: "파일 전송 실패"
          });
        }
        // 파일 전송 후 삭제
        else {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('File deletion error:', unlinkErr);
            }
          });
        }
      });
    }
    else {
      res.status(404).json({
        status: "error",
        error: "스크린샷 생성 실패"
      });
    }
  }
  catch (err) {
    console.error('Internal server error:', err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});