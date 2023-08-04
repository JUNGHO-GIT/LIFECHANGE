// adminRouter.ts
import {Router, Request, Response} from "express";
import * as adminService from "../service/adminService";

const adminRouter = Router();

// userList --------------------------------------------------------------------------------------->
adminRouter.get("/userList", async (req: Request, res: Response) => {
  try {
    const userList = await adminService.userList();
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

export default adminRouter;
