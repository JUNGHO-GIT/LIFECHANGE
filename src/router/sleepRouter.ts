// sleepRouter.ts
import {Router, Request, Response} from "express";
import * as sleepService from "../service/sleepService";

const sleepRouter = Router();

// 1. sleepList ----------------------------------------------------------------------------------->
sleepRouter.get("/sleepList", async (req: Request, res: Response) => {
  try {
    const sleepList = await sleepService.sleepList (
      req.query.user_id,
      req.query.sleep_regdate
    );
    if (sleepList) {
      res.send(sleepList);
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

// 2. sleepDetail --------------------------------------------------------------------------------->
sleepRouter.get("/sleepDetail", async (req: Request, res: Response) => {
  try {
    const sleepDetail = await sleepService.sleepDetail (
      req.query._id
    );
    if (sleepDetail) {
      res.send(sleepDetail);
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

// 3. sleepInsert --------------------------------------------------------------------------------->
sleepRouter.post("/sleepInsert", async (req: Request, res: Response) => {
  try {
    const sleepInsert = await sleepService.sleepInsert (
      req.body
    );
    if (sleepInsert) {
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

// 4. sleepUpdate --------------------------------------------------------------------------------->
sleepRouter.put("/sleepUpdate", async (req: Request, res: Response) => {
  try {
    const sleepUpdate = await sleepService.sleepUpdate (
      req.query._id,
      req.body
    );
    if (sleepUpdate) {
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

// 5. sleepDelete --------------------------------------------------------------------------------->
sleepRouter.delete("/sleepDelete", async (req: Request, res: Response) => {
  try {
    const sleepDelete = await sleepService.sleepDelete (
      req.query._id
    );
    if (sleepDelete) {
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

export default sleepRouter;