// moneyRouter.ts

import {Router, Request, Response} from "express";
import * as moneyService from "../service/moneyService";

const moneyRouter = Router();

// 1-1. moneyList --------------------------------------------------------------------------------->
moneyRouter.get("/moneyList", async (req: Request, res: Response) => {
  try {
    const moneyList = await moneyService.moneyList (
      req.query.user_id,
      req.query.money_dur
    );
    if (moneyList) {
      res.send(moneyList);
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

// 1-2. moneyAvg ---------------------------------------------------------------------------------->
moneyRouter.get("/moneyAvg", async (req: Request, res: Response) => {
  try {
    const moneyAvg = await moneyService.moneyAvg (
      req.query.user_id,
      req.query.money_dur,
      req.query.money_part_val,
      req.query.money_title_val,
    );
    if (moneyAvg) {
      res.send(moneyAvg);
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

// 2. moneyDetail --------------------------------------------------------------------------------->
moneyRouter.get("/moneyDetail", async (req: Request, res: Response) => {
  try {
    const moneyDetail = await moneyService.moneyDetail (
      req.query._id,
      req.query.money_section_id
    );
    if (moneyDetail) {
      res.send(moneyDetail);
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

// 3. moneyInsert --------------------------------------------------------------------------------->
moneyRouter.post("/moneyInsert", async (req: Request, res: Response) => {
  try {
    const moneyInsert = await moneyService.moneyInsert (
      req.body.user_id,
      req.body.MONEY
    );
    if (moneyInsert) {
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

// 4. moneyUpdate --------------------------------------------------------------------------------->
moneyRouter.put("/moneyUpdate", async (req: Request, res: Response) => {
  try {
    const moneyUpdate = await moneyService.moneyUpdate (
      req.body._id,
      req.body.MONEY
    );
    if (moneyUpdate) {
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

// 5. moneyDelete --------------------------------------------------------------------------------->
moneyRouter.delete("/moneyDelete", async (req: Request, res: Response) => {
  try {
    const moneyDelete = await moneyService.moneyDelete (
      req.query._id,
      req.query.money_section_id
    );
    if (moneyDelete) {
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

export default moneyRouter;