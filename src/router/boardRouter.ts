// boardRouter.ts
import {Router, Request, Response} from "express";
import * as boardService from "../service/boardService";

const boardRouter = Router();

// boardList -------------------------------------------------------------------------------------->
boardRouter.get("/boardList", async (req: Request, res: Response) => {
  try {
    const boardList = await boardService.boardList();
    if (boardList) {
      res.send(boardList);
    }
    else {
      res.send("fail");
    }
  }
  catch (err) {
    res.status(500).send(err);
  }
});

// boardWrite ------------------------------------------------------------------------------------->
boardRouter.post("/boardWrite", async (req: Request, res: Response) => {
  try {
    const boardWrite = await boardService.boardWrite (
      req.body.boardId,
      req.body.boardTitle,
      req.body.boardContent,
      req.body.boardDate
    );
    if (boardWrite) {
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

// boardDetail ------------------------------------------------------------------------------------>

// boardUpdate ------------------------------------------------------------------------------------>

// boardDelete ------------------------------------------------------------------------------------>

export default boardRouter;