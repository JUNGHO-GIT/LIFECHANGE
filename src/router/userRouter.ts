// userRouter.ts
import {Router, Request, Response} from "express";
import * as userService from "../service/userService";

const userRouter = Router();

// checkIdPw -------------------------------------------------------------------------------------->
userRouter.post("/checkIdPw", async (req: Request, res: Response) => {
  try {
    const userIdPwCheck = await userService.checkIdPw(req.body.userId, req.body.userPw);

    if (userIdPwCheck) {
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

// signup ----------------------------------------------------------------------------------------->
userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const userIdCheck = await userService.checkId(req.body.userId);

    if (userIdCheck) {
      res.send("duplicate");
    }
    else {
      const user = await userService.userSignup(req.body.userId, req.body.userPw);
      if (user) {
        res.send("success");
      }
      else {
        res.send("fail");
      }
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// login ------------------------------------------------------------------------------------------>
userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await userService.userLogin(req.body.userId, req.body.userPw);
    if (user) {
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
    console.error(err);
    res.status(500).send(err);
  }
});

// userUpdate ------------------------------------------------------------------------------------->
userRouter.put("/userUpdate", async (req: Request, res: Response) => {
  try {
    const user = await userService.userUpdate(req.body.userId, req.body.userPw);
    if (user) {
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

// userDelete ------------------------------------------------------------------------------------->
userRouter.delete("/userDelete", async (req: Request, res: Response) => {
  try {
    const user = await userService.userDelete(req.body.userId);
    if (user) {
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

export default userRouter;