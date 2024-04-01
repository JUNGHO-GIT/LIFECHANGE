// calendarRouter.js

import express from "express";
import * as service from "../service/calendarService.js";
export const calendarRouter = express.Router();

// 1. list ---------------------------------------------------------------------------------------->
calendarRouter.get("/list", async (req, res) => {
  try {
    const result = await service.list (
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
calendarRouter.get("/detail", async (req, res) => {
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

// 3. insert ------------------------------------------------------------------------------------>
calendarRouter.post("/save", async (req, res) => {
  try {
    const result = await service.insert (
      req.body.user_id,
      req.body.CALENDAR
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
calendarRouter.put("/update", async (req, res) => {
  try {
    const result = await service.update (
      req.body._id,
      req.body.CALENDAR
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
calendarRouter.delete("/delete", async (req, res) => {
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