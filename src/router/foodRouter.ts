// foodRouter.ts
import {Router, Request, Response} from "express";
import * as foodService from "../service/foodService";

const foodRouter = Router();

// 1. foodList ------------------------------------------------------------------------------------>

// 2-1. foodDetail -------------------------------------------------------------------------------->
foodRouter.get ("/foodDetail", async (req: Request, res: Response) => {
  try {
    const foodDetail = await foodService.foodDetail (
      req.query.user_id as string,
      req.query.food_regdate as string,
      req.query.food_category as string
    );
    if (foodDetail) {
      res.send(foodDetail);
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

// 2-2. foodInfo ---------------------------------------------------------------------------------->
foodRouter.get ("/foodInfo", async (req: Request, res: Response) => {
  try {
    const foodInfo = await foodService.foodInfo (
      req.query._id as string,
      req.query.user_id as string,
      req.query.food_regdate as string,
    );
    if (foodInfo) {
      res.send(foodInfo);
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

// 3-1. foodInsert -------------------------------------------------------------------------------->
foodRouter.post ("/foodInsert", async (req: Request, res: Response) => {
  try {
    const foodInsert = await foodService.foodInsert (
      req.body
    );
    if (foodInsert) {
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

// 3-2. foodTotal --------------------------------------------------------------------------------->
foodRouter.post ("/foodTotal", async (req: Request, res: Response) => {
  try {
    const foodTotal = await foodService.foodTotal (
      req.body.user_id as string,
      req.body.food_regdate as string,
    );
    if (foodTotal) {
      res.send(foodTotal);
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

// 4. foodUpdate ---------------------------------------------------------------------------------->

// 5. foodDelete ---------------------------------------------------------------------------------->
foodRouter.delete ("/foodDelete", async (req: Request, res: Response) => {
  try {
    const foodDelete = await foodService.foodDelete (
      req.query._id as string,
      req.query.user_id as string,
      req.query.food_regdate as string,
    );
    if (foodDelete) {
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

export default foodRouter;
