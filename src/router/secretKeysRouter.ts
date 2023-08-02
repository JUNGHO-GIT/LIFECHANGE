// secretKeysRouter.ts

import {Router, Request, Response} from "express";
import * as secretKeysService from "../service/secretKeysService";

const secretKeysRouter = Router();

// secretKeys -------------------------------------------------------------------------------------->
secretKeysRouter.post("/secretKeys", async (req: Request, res: Response) => {
  try {
    const secretKeys = await secretKeysService.secretKeys(req.body.secretKeys);
    if (secretKeys) {
      res.send("success");
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    res.status(500).send(err);
  }
});

export default secretKeysRouter;