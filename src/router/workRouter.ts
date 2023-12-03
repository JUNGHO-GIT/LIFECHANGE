// workRouter.ts
import {Router, Request, Response} from "express";
import * as workService from "../service/workService";

const workRouter = Router();

// 1-1. workList ---------------------------------------------------------------------------------->
workRouter.get("/workList", async (req: Request, res: Response) => {
  try {
    const workList = await workService.workList (
      req.query.user_id,
      req.query.work_dur
    );
    if (workList) {
      res.send(workList);
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

// 1-2. workAvg ----------------------------------------------------------------------------------->
workRouter.get("/workAvg", async (req: Request, res: Response) => {
  try {
    const workAvg = await workService.workAvg (
      req.query.user_id,
      req.query.work_dur,
      req.query.work_part_val,
      req.query.work_title_val,
    );
    if (workAvg) {
      res.send(workAvg);
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

// 2. workDetail ---------------------------------------------------------------------------------->
workRouter.get("/workDetail", async (req: Request, res: Response) => {
  try {
    const workDetail = await workService.workDetail (
      req.query._id,
      req.query.workSection_id
    );
    if (workDetail) {
      res.send(workDetail);
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

// 3. workInsert ---------------------------------------------------------------------------------->
workRouter.post("/workInsert", async (req: Request, res: Response) => {
  try {
    const workInsert = await workService.workInsert (
      req.body.user_id,
      req.body.WORK
    );
    if (workInsert) {
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

// 4. workUpdate ---------------------------------------------------------------------------------->
workRouter.put("/workUpdate", async (req: Request, res: Response) => {
  try {
    const workUpdate = await workService.workUpdate (
      req.body._id,
      req.body.WORK
    );
    if (workUpdate) {
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

// 5. workDelete ---------------------------------------------------------------------------------->
workRouter.delete("/workDelete", async (req: Request, res: Response) => {
  try {
    const workDelete = await workService.workDelete (
      req.query._id,
      req.query.workSection_id
    );
    if (workDelete) {
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

export default workRouter;