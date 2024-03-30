// boardRouter.js

import express from "express";
import * as service from "../service/boardService.js";
export const boardRouter = express.Router();

// 1. list ---------------------------------------------------------------------------------------->
boardRouter.get("/list", async (req, res) => {
  try {
    const result= await service.list (
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

// 2. detail -------------------------------------------------------------------------------------->
boardRouter.get("/detail", async (req, res) => {
  try {
    const result = await service.detail (
      req.query._id
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

// 3. insert -------------------------------------------------------------------------------------->
boardRouter.post("/insert", async (req, res) => {
  try {
    const result = await service.insert (
      req.body.user_id,
      req.body.BOARD
    );
    if (result) {
      res.send("success");
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

// 4. update -------------------------------------------------------------------------------------->
boardRouter.put("/update", async (req, res) => {
  try {
    const result = await service.update (
      req.body._id,
      req.body.BOARD
    );
    if (result) {
      res.send("success");
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

// 5. deletes ------------------------------------------------------------------------------------->
boardRouter.delete("/delete", async (req, res) => {
  try {
    const result = await service.deletes (
      req.query._id
    );
    if (result) {
      res.send("success");
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