// foodRouter.js

import express from "express";
import * as service from "../service/foodService.js";
export const foodRouter = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
foodRouter.get ("/food/list", async (req, res) => {
  try {
    const result = await service.list (
      req.query.user_id,
      req.query.food_dur,
      req.query.food_category,
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

// 1-2. total ------------------------------------------------------------------------------------->
foodRouter.get ("/food/total", async (req, res) => {
  try {
    const result = await service.total (
      req.query.user_id,
      req.query.food_dur,
      req.query.food_category,
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

// 1-3. avg --------------------------------------------------------------------------------------->
foodRouter.get("/food/avg", async (req, res) => {
  try {
    const result = await service.avg (
      req.query.user_id,
      req.query.food_dur,
      req.query.food_category,
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

// 2-1. search ------------------------------------------------------------------------------------>
foodRouter.get ("/food/search", async (req, res) => {
  try {
    const result = await service.search (
      req.query.user_id,
      req.query.food_dur,
      req.query.food_category,
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

// 2-1. detail ------------------------------------------------------------------------------------>
/* foodRouter.get ("/food/detail", async (req, res) => {
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
}); */

// 3-1. insert ------------------------------------------------------------------------------------>
foodRouter.post ("/food/insert", async (req, res) => {
  try {
    const result = await service.insert (
      req.body.user_id,
      req.body.FOOD
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
foodRouter.put("/food/update", async (req, res) => {
  try {
    const result = await service.update (
      req.body._id,
      req.body.FOOD
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
foodRouter.delete("/food/delete", async (req, res) => {
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