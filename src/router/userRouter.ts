// userRouter.ts

import {Router, Request, Response} from "express";
import * as userService from "../service/userService";

const userRouter = Router();


// signup ----------------------------------------------------------------------------------------->
userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const userIdCheck = await userService.checkId(req.body.userId);

    if (userIdCheck) {
      res.send("duplicate");
    }
    else {
      const user = await userService.signupUser(req.body.userId, req.body.userPw);
      if (user) {
        res.send("success");
      }
      else {
        res.send("fail");
      }
    }
  }
  catch (err) {
    res.status(500).send(err);
  }
});

// login ------------------------------------------------------------------------------------------>
userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await userService.loginUser(req.body.userId, req.body.userPw);
    if (user) {
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

// userInfo --------------------------------------------------------------------------------------->
userRouter.post("/userInfo", async (req: Request, res: Response) => {
  try {
    const user = await userService.userInfo(req.body.userId);
    if (user) {
      res.send(user);
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    res.status(500).send(err);
  }
});

export default userRouter;