import {Router, Request, Response} from "express";
import axios from 'axios';

const nutritionRouter = Router();

nutritionRouter.get('/getFood', async (req, res) => {
  const food_id = req.query.food_id as string;

  try {
    const response = await axios({

      method: 'GET',
      url: 'www.fatsecret.com.',
      params: {
        method: 'food.get.v3',
        food_id: food_id,
        format: 'json',
      },
    });
    res.json(response.data);
  }
  catch (err:any) {
    res.status(500).json({ err: err.message });
  }
});

export default nutritionRouter;
