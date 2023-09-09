// calendarRouter.ts
import {Router, Request, Response} from "express";
import * as calendarService from "../service/calendarService";

const calendarRouter = Router();

// 1. calendarList -------------------------------------------------------------------------------->
calendarRouter.get("/calendarList", async (req: Request, res: Response) => {
  try {
    const calendarList = await calendarService.calendarList (
    );
    if (calendarList) {
      res.send(calendarList);
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

// 2. calendarDetail ------------------------------------------------------------------------------>
calendarRouter.get("/calendarDetail", async (req: Request, res: Response) => {
  try {
    const calendarDetail = await calendarService.calendarDetail (
      req.query._id
    );
    if (calendarDetail) {
      res.send(calendarDetail);
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

// 3. calendarInsert ------------------------------------------------------------------------------>
calendarRouter.post("/calendarInsert", async (req: Request, res: Response) => {
  try {
    const calendarInsert = await calendarService.calendarInsert (
      req.body
    );
    if (calendarInsert) {
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

// 4. calendarUpdate ------------------------------------------------------------------------------>
calendarRouter.put("/calendarUpdate", async (req: Request, res: Response) => {
  try {
    const calendarUpdate = await calendarService.calendarUpdate (
      req.body._id,
      req.body.CALENDAR
    );
    if (calendarUpdate) {
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

// 5. calendarDelete ------------------------------------------------------------------------------>
calendarRouter.delete("/calendarDelete", async (req: Request, res: Response) => {
  try {
    const calendarDelete = await calendarService.calendarDelete (
      req.query._id
    );
    if (calendarDelete) {
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

export default calendarRouter;