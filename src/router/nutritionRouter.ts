import express from "express";
import requestPromise from "request-promise";
import oauthSignature from "oauth-signature";
require("dotenv").config();

interface Parameters {
  oauth_consumer_key: string;
  oauth_signature_method: string;
  oauth_timestamp: number;
  oauth_nonce: string;
  oauth_version: string;
  format: string;
  method: string;
  search_expression: string;
  oauth_signature?: string;
}

const nutritionRouter = express();
nutritionRouter.use(express.json());
nutritionRouter.use(express.urlencoded({extended: true}));

nutritionRouter.post('/search', async (req, res) => {
  const httpMethod = 'foods.search',
  url = 'http://platform.fatsecret.com/rest/server.api',
  parameters: Parameters = {
    oauth_consumer_key : process.env.FATSECRET_API_KEY!,
    oauth_signature_method : 'HMAC-SHA1',
    oauth_timestamp : new Date().getTime(),
    oauth_nonce : '',
    oauth_version : '1.0',
    format: 'json',
    method: 'foods.search',
    search_expression: req.body.query,
  },
  consumerSecret = process.env.FATSECRET_SECRET!,
  encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret);

  parameters.oauth_signature = encodedSignature;

  try {
    const foodSearch = await requestPromise({url: url, qs: parameters});
    res.json(JSON.parse(foodSearch));
  } catch (err) {
    console.error(err);
  }
});

nutritionRouter.listen(5000, () => console.log('Server is running on port 5000'));

export default nutritionRouter;