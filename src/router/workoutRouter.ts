// workoutRouter.ts
import {Router, Request, Response} from "express";
import * as workoutService from "../service/workoutService";

const workoutRouter = Router();

// 1. workoutList -------------------------------------------------------------------------------->
workoutRouter.get("/workoutList", async (req: Request, res: Response) => {
  try {
    const workoutList = await workoutService.workoutList (
      req.query.user_id,
      req.query.workout_regdate
    );
    if (workoutList) {
      res.send(workoutList);
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

// 2. workoutDetail ------------------------------------------------------------------------------>
workoutRouter.get("/workoutDetail", async (req: Request, res: Response) => {
  try {
    const workoutDetail = await workoutService.workoutDetail (
      req.query._id
    );
    if (workoutDetail) {
      res.send(workoutDetail);
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

// 3. workoutInsert ------------------------------------------------------------------------------>
workoutRouter.post("/workoutInsert", async (req: Request, res: Response) => {
  try {
    const workoutInsert = await workoutService.workoutInsert (
      req.body.user_id,
      req.body.WORKOUT
    );
    if (workoutInsert) {
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

// 4. workoutUpdate ------------------------------------------------------------------------------>
workoutRouter.put("/workoutUpdate", async (req: Request, res: Response) => {
  try {
    const workoutUpdate = await workoutService.workoutUpdate (
      req.body._id,
      req.body.WORKOUT
    );
    if (workoutUpdate) {
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

// 5. workoutDelete ------------------------------------------------------------------------------>
workoutRouter.delete("/workoutDelete", async (req: Request, res: Response) => {
  try {
    const workoutDelete = await workoutService.workoutDelete (
      req.query._id
    );
    if (workoutDelete) {
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

export default workoutRouter;