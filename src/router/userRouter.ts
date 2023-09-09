// userRouter.ts
import {Router, Request, Response} from "express";
import * as userService from "../service/userService";

const userRouter = Router();

// 1. userList ------------------------------------------------------------------------------------>
userRouter.get("/userList", async (req: Request, res: Response) => {
  try {
    const userList = await userService.userList (
    );
    if (userList) {
      res.send(userList);
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

// 2. userDetail ---------------------------------------------------------------------------------->
userRouter.post("/userDetail", async (req: Request, res: Response) => {
  try {
    const userDetail = await userService.userDetail (
      req.body.user_id
    );
    if (userDetail) {
      res.send(userDetail);
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
    const userCheckId = await userService.userCheckId (
      req.body.user_id
    );
    if (userCheckId) {
      res.send("duplicate");
    }
    else {
      const userInsert = await userService.userInsert (
        req.body.user_id,
        req.body.user_pw
      );
      if (userInsert) {
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
    const userLogin = await userService.userLogin (
      req.body.user_id,
      req.body.user_pw
    );
    if (userLogin) {
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
    const userUpdate = await userService.userUpdate (
      req.body._id,
      req.body.USER
    );
    if (userUpdate) {
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

// 4-2. userCheckIdPw ----------------------------------------------------------------------------->
userRouter.post("/userCheckIdPw", async (req: Request, res: Response) => {
  try {
    const userCheckIdPw = await userService.userCheckIdPw (
      req.body.user_id,
      req.body.user_pw
    );
    if (userCheckIdPw) {
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
    const userDelete = await userService.userDelete (
      req.body.user_id
    );
    if (userDelete) {
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