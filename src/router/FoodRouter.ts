// foodRouter.ts
import {Router, Request, Response} from "express";
import * as foodService from "../service/foodService";

const foodRouter = Router();

// 1. foodList ------------------------------------------------------------------------------------>

// 2. foodDetail ---------------------------------------------------------------------------------->

// 3-1. foodInsert -------------------------------------------------------------------------------->
foodRouter.post("/foodInsert", async (req: Request, res: Response) => {
  try {
    const foodInsert = await foodService.foodInsert (
      req.body.user_id,
      req.body.food_name,
      req.body.food_brand,
      req.body.food_category,
      req.body.food_serving,
      req.body.food_calories,
      req.body.food_carb,
      req.body.food_protein,
      req.body.food_fat
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
foodRouter.post("/foodTotal/:user_id/:food_regdate", async (req: Request, res: Response) => {
  try {
    const foodTotal = await foodService.foodTotal (
      req.params.user_id,
      req.params.food_regdate
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

export default foodRouter;