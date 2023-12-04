// foodRouter.ts
import {Router, Request, Response} from "express";
import * as foodService from "../service/foodService";

const foodRouter = Router();

// 1-1. foodList ---------------------------------------------------------------------------------->
foodRouter.get ("/foodList", async (req: Request, res: Response) => {
  try {
    const foodList = await foodService.foodList (
      req.query.user_id,
      req.query.food_dur,
      req.query.food_category,
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

// 1-2. foodTotal --------------------------------------------------------------------------------->
foodRouter.get ("/foodTotal", async (req: Request, res: Response) => {
  try {
    const foodTotal = await foodService.foodTotal (
      req.query.user_id,
      req.query.food_dur,
      req.query.food_category,
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

// 1-3. foodAvg ----------------------------------------------------------------------------------->
foodRouter.get("/foodAvg", async (req: Request, res: Response) => {
  try {
    const foodAvg = await foodService.foodAvg (
      req.query.user_id,
      req.query.food_dur,
      req.query.food_category,
    );
    if (foodAvg) {
      res.send(foodAvg);
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

// 2-1. foodSearchResult -------------------------------------------------------------------------->
foodRouter.get ("/foodSearchResult", async (req: Request, res: Response) => {
  try {
    const foodSearchResult = await foodService.foodSearchResult (
      req.query.user_id,
      req.query.food_dur,
      req.query.food_category,
    );
    if (foodSearchResult) {
      res.send(foodSearchResult);
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
      req.query._id
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
      req.body.user_id,
      req.body.FOOD
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

// 5. foodDelete ---------------------------------------------------------------------------------->
foodRouter.delete ("/foodDelete", async (req: Request, res: Response) => {
  try {
    const foodDelete = await foodService.foodDelete (
      req.query._id
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
