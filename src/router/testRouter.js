// testRouter.js

import express from "express";
import * as service from "../service/testService.js";
export const testRouter = express.Router();

// 1-1. search ------------------------------------------------------------------------------------>
testRouter.post("/search", async (req, res) => {
  try {
    const result = await service.search (
      req.body.query,
      req.body.page
    );
    if (result) {
      res.send(result);
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});