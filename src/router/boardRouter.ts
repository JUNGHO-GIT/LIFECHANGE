// boardRouter.ts
import {Router, Request, Response} from "express";
import * as boardService from "../service/boardService";

const boardRouter = Router();

// 1. boardList ----------------------------------------------------------------------------------->
boardRouter.get("/boardList", async (req: Request, res: Response) => {
  try {
    const boardList = await boardService.boardList (
    );
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

// 2. boardDetail --------------------------------------------------------------------------------->
boardRouter.get("/boardDetail", async (req: Request, res: Response) => {
  try {
    const boardDetail = await boardService.boardDetail (
      req.query._id
    );
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

// 3. boardInsert --------------------------------------------------------------------------------->
boardRouter.post("/boardInsert", async (req: Request, res: Response) => {
  try {
    const boardInsert = await boardService.boardInsert (
      req.body
    );
    if (boardInsert) {
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

// 4. boardUpdate --------------------------------------------------------------------------------->
boardRouter.put ("/boardUpdate", async (req: Request, res: Response) => {
  try {
    const boardUpdate = await boardService.boardUpdate (
      req.body._id,
      req.body.BOARD
    );
    if (boardUpdate) {
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

// 5. boardDelete --------------------------------------------------------------------------------->
boardRouter.delete("/boardDelete", async (req: Request, res: Response) => {
  try {
    const boardDelete = await boardService.boardDelete (
      req.query._id
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