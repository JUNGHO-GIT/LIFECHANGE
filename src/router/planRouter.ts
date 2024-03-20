// planRouter.ts

import {Router, Request, Response} from "express";
import * as planService from "../service/planService";

const planRouter = Router();

// 1-1. planList --------------------------------------------------------------------------------->
planRouter.get("/planList", async (req: Request, res: Response) => {
  try {
    const planList = await planService.planList (
      req.query.user_id,
      req.query.plan_dur
    );
    if (planList) {
      res.send(planList);
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

// 1-2. planAvg ---------------------------------------------------------------------------------->
planRouter.get("/planAvg", async (req: Request, res: Response) => {
  try {
    const planAvg = await planService.planAvg (
      req.query.user_id,
      req.query.plan_dur,
      req.query.plan_part_val,
      req.query.plan_title_val,
    );
    if (planAvg) {
      res.send(planAvg);
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

// 2. planDetail --------------------------------------------------------------------------------->
planRouter.get("/planDetail", async (req: Request, res: Response) => {
  try {
    const planDetail = await planService.planDetail (
      req.query._id,
      req.query.planSection_id
    );
    if (planDetail) {
      res.send(planDetail);
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

// 3. planInsert --------------------------------------------------------------------------------->
planRouter.post("/planInsert", async (req: Request, res: Response) => {
  try {
    const planInsert = await planService.planInsert (
      req.body.user_id,
      req.body.PLAN
    );
    if (planInsert) {
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

// 4. planUpdate --------------------------------------------------------------------------------->
planRouter.put("/planUpdate", async (req: Request, res: Response) => {
  try {
    const planUpdate = await planService.planUpdate (
      req.body._id,
      req.body.PLAN
    );
    if (planUpdate) {
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

// 5. planDelete --------------------------------------------------------------------------------->
planRouter.delete("/planDelete", async (req: Request, res: Response) => {
  try {
    const planDelete = await planService.planDelete (
      req.query._id,
      req.query.planSection_id
    );
    if (planDelete) {
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

export default planRouter;