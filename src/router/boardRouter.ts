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
    console.error(err);
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
    console.error(err);
    res.status(500).send(err);
  }
});

// boardDetail ------------------------------------------------------------------------------------>
boardRouter.get("/boardDetail/:_id", async (req: Request, res: Response) => {
  try {
    const boardDetail = await boardService.boardDetail(req.params._id);

    if (boardDetail) {
      res.send(boardDetail);
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

// boardUpdate ------------------------------------------------------------------------------------>
boardRouter.put("/boardUpdate/:_id", async (req: Request, res: Response) => {
  try {
    const boardUpdate = await boardService.boardUpdate(req.params._id, req.body);

    if (boardUpdate) {
      res.send("success");
    }
    else {
      res.send('fail');
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// boardDelete ------------------------------------------------------------------------------------>
boardRouter.delete("/boardDelete/:_id", async (req: Request, res: Response) => {
  try {
    const boardDelete = await boardService.boardDelete (
      req.params._id
    );

    if (boardDelete) {
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

export default boardRouter;