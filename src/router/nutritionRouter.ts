// nutritionRouter.ts
import {Router, Request, Response} from "express";
import axios from "axios";
import * as querystring from 'querystring';

const nutritionRouter = Router();

const token = `eyJhbGciOiJSUzI1NiIsImtpZCI6IjVGQUQ4RTE5MjMwOURFRUJCNzBCMzU5M0E2MDU3OUFEMUM5NjgzNDkiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJYNjJPR1NNSjN1dTNDeldUcGdWNXJSeVdnMGsifQ.eyJuYmYiOjE2OTE2ODE4NDYsImV4cCI6MTY5MTc2ODI0NiwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiI1NWY3ZDRlNjJlMDY0ODkzYmI0Y2FjYjgzYmM2OTdlMiIsInNjb3BlIjpbImJhc2ljIl19.iRGYh9Pou1Ht0W24uRY6V5RvV3tVRIK6OdGeVfsKTTGCIfLd81jXILsSiI9sjqjkPJnamqRU3aCmylweTt-h2l1OIGI49_awS1IeGvBPGmjzLHQfNXj5PadHtHCl6e_DsJi_o0Gmy4hJFTTDTRTQv_JKsmMbNppT8a2ZIPv1YophUuDzTz6h30imfQJD6FBIgVbCEOYrqV6l4VMkNOe_jHJ3JM4CnAJDCUCDKofcu8IiU3VTY9o4SCOOyxsTXDI842KOFQK_cI1lkwYGcwWtU2OWQoeIoq_EUKL37ypKaE5t3JXOs-Yf0xk8TV7ix48JpUJuvfjTOMHmRrHWnNTgYg`;

// ------------------------------------------------------------------------------------------------>
nutritionRouter.post("/nutritionList", async (req: Request, res: Response) => {
  const { foodName } = req.body;
  try {
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
  catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default nutritionRouter;