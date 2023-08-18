// nutritionRouter.ts
import {Router, Request, Response} from "express";
import axios from "axios";
import * as querystring from "querystring";

const nutritionRouter = Router();

const clientID = "55f7d4e62e064893bb4cacb83bc697e2";
const clientSecret = "a8fb786644f741a08df53873d8e37773";

let token: string;

// ------------------------------------------------------------------------------------------------>
nutritionRouter.post("/nutritionList", async (req: Request, res: Response) => {
  try {
    // request token from fatsecret
    const options = {
      method: "POST" as const,
      url: "https://oauth.fatsecret.com/connect/token",
      auth: {
        username: clientID,
        password: clientSecret,
      },
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: "grant_type=client_credentials&scope=basic",
    };
    const tokenResponse = await axios(options);
    token = tokenResponse.data.access_token;

    // request food list from fatsecret
    const { foodName } = req.body;
    const postData = querystring.stringify({
      method: "foods.search",
      search_expression: foodName,
      format: "json",
    });

    const searchResponse = await axios.post(
      "https://platform.fatsecret.com/rest/server.api",
      postData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.json(searchResponse.data);
  }
  catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ------------------------------------------------------------------------------------------------>
nutritionRouter.get("/nutritionDetail/:food_id", async (req: Request, res: Response) => {

  try {
    const options = {
      method: "POST" as const,
      url: `https://platform.fatsecret.com/rest/server.api`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        method: "food.get.v2",
        food_id: req.params.food_id,
        format: "json",
      },

    };
    const response = await axios(options);
    res.json(response.data);
  }
  catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default nutritionRouter;