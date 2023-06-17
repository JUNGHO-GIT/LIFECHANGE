import {Router, Request, Response} from "express";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import * as userService from "../service/userService";

const router = Router();

// read ------------------------------------------------------------------------------------------->
router.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "client/public/index.html"));
});

// secretKey -------------------------------------------------------------------------------------->
router.post("/secretKey", async (req: Request, res: Response) => {
  try {
    const user = await userService.secretKey(req.body.secretKey);
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

// signup ----------------------------------------------------------------------------------------->
router.post("/signup", async (req: Request, res: Response) => {
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
router.post("/login", async (req: Request, res: Response) => {
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

// myPage ----------------------------------------------------------------------------------------->
router.post("/myPage", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const user = await userService.myPage(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  }
  catch (err) {
    res.status(500).send("Server error");
  }
});


export default router;