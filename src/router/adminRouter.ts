import {Router, Request, Response} from "express";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import * as adminService from "../service/adminService";

const router = Router();

// userList --------------------------------------------------------------------------------------->
router.get("/admin/userList", async (req: Request, res: Response) => {
  try {
    const userList = await adminService.userList(req.body.userList);
    if (userList) {
      res.send(userList);
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    res.status(500).send(err);
  }
});

// read ------------------------------------------------------------------------------------------->
router.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/public/index.html"));
});
