// workoutRouter.ts
import {Router, Request, Response} from "express";
import * as workoutService from "../service/workoutService";

const workoutRouter = Router();

// 1. workoutList -------------------------------------------------------------------------------->
workoutRouter.get("/workoutList", async (req: Request, res: Response) => {
  try {
    const workoutList = await workoutService.workoutList (
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
workoutRouter.get("/workoutDetail/:_id", async (req: Request, res: Response) => {
  try {
    const workoutDetail = await workoutService.workoutDetail (
      req.params._id
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
      req.body
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
workoutRouter.put("/workoutUpdate/:_id", async (req: Request, res: Response) => {
  try {
    const workoutUpdate = await workoutService.workoutUpdate (
      req.params._id,
      req.body
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
workoutRouter.delete("/workoutDelete/:_id", async (req: Request, res: Response) => {
  try {
    const workoutDelete = await workoutService.workoutDelete (
      req.params._id
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