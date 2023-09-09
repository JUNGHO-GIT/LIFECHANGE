// foodRouter.ts
import {Router, Request, Response} from "express";
import * as foodService from "../service/foodService";

const foodRouter = Router();

// 1-1. foodList ---------------------------------------------------------------------------------->
foodRouter.get ("/foodList", async (req: Request, res: Response) => {
  try {
    const foodList = await foodService.foodList (
      req.query.user_id as string,
      req.query.food_regdate as string
    );
    if (foodList) {
      res.send(foodList);
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

// 1-2. foodListPart ------------------------------------------------------------------------------>
foodRouter.get ("/foodListPart", async (req: Request, res: Response) => {
  try {
    const foodListPart = await foodService.foodListPart (
      req.query.user_id as string,
      req.query.food_regdate as string,
      req.query.food_category as string
    );
    if (foodListPart) {
      res.send(foodListPart);
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

// 2-1. foodDetail -------------------------------------------------------------------------------->
foodRouter.get ("/foodDetail", async (req: Request, res: Response) => {
  try {
    const foodDetail = await foodService.foodDetail (
      req.query._id as string,
      req.query.user_id as string,
      req.query.food_regdate as string,
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

// 4. foodUpdate ---------------------------------------------------------------------------------->
foodRouter.put("/foodUpdate", async (req: Request, res: Response) => {
  try {
    const foodUpdate = await foodService.foodUpdate (
      req.body._id,
      req.body.FOOD
    );
    if (foodUpdate) {
      res.send(foodUpdate);
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
