// userRouter.ts
import {Router, Request, Response} from "express";
import * as userService from "../service/userService";

const userRouter = Router();

// 1. userList ------------------------------------------------------------------------------------>

// 2. userDetail ---------------------------------------------------------------------------------->
userRouter.post("/userDetail", async (req: Request, res: Response) => {
  try {
    const user = await userService.userDetail(req.body.user_id);
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

// 3-1. userInsert -------------------------------------------------------------------------------->
userRouter.post("/userInsert", async (req: Request, res: Response) => {
  try {
    const user_idCheck = await userService.checkId(req.body.user_id);

    if (user_idCheck) {
      res.send("duplicate");
    }
    else {
      const user = await userService.userSignup(req.body.user_id, req.body.user_pw);
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

// 3-2. userLogin --------------------------------------------------------------------------------->
userRouter.post("/userLogin", async (req: Request, res: Response) => {
  try {
    const user = await userService.userLogin(req.body.user_id, req.body.user_pw);
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

// 4-1. userUpdate -------------------------------------------------------------------------------->
userRouter.put("/userUpdate", async (req: Request, res: Response) => {
  try {
    const user = await userService.userUpdate(req.body.user_id, req.body.user_pw);
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

// 4-2. checkIdPw --------------------------------------------------------------------------------->
userRouter.post("/checkIdPw", async (req: Request, res: Response) => {
  try {
    const user_idPwCheck = await userService.checkIdPw(req.body.user_id, req.body.user_pw);

    if (user_idPwCheck) {
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

// 5. userDelete ---------------------------------------------------------------------------------->
userRouter.delete("/userDelete", async (req: Request, res: Response) => {
  try {
    const user = await userService.userDelete(req.body.user_id);
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