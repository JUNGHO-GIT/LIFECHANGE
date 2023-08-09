import {Router, Request, Response} from "express";
import axios from "axios";

const nutritionRouter = Router();

const CLIENT_ID = "55f7d4e62e064893bb4cacb83bc697e2";
const CLIENT_SECRET = "a8fb786644f741a08df53873d8e37773";

nutritionRouter.post("/search", async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.body;

    if (!searchTerm) {
      return res.status(400).json({ error: "Missing searchTerm field" });
    }

    // -------------------------------------------------------------------------------------------->
    const tokenResponse = await axios.post("https://oauth.fatsecret.com/connect/token", {
      method: 'POST',
      url: 'https://oauth.fatsecret.com/connect/token',
      auth : {
        username: CLIENT_ID,
        password: CLIENT_SECRET
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded'},
      params: {
        'grant_type': 'client_credentials',
        'scope' : 'basic'
      },
    });
    console.log('Token Response:', tokenResponse.data); // 로깅 추가

    const accessToken = tokenResponse.data.access_token;


    // -------------------------------------------------------------------------------------------->
    const searchResponse = await axios.post("https://platform.fatsecret.com/rest/server.api", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      params: {
        method: "foods.search.v2",
        search_expression: searchTerm,
        format: "json"
      },
    });
    console.log('Search Response:', searchResponse.data); // 로깅 추가

    if (!searchResponse.data || !searchResponse.data.foods) {
      return res.status(404).json({ error: "No foods found" });
    }

    res.json({foods: searchResponse.data.foods});
  }
  catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default nutritionRouter;