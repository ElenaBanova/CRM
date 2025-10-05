import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { commentService } from "../services/comment.service";

class CommentController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await commentService.getAll(req.query);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idApplication, idUser } = req.params;
      const newComment = req.body as string;
      const comment = await commentService.create({
        comment: newComment,
        _userId: idUser,
        _idApplication: idApplication,
      });
      res.status(StatusCodesEnum.CREATED).json(comment);
    } catch (e) {
      next(e);
    }
  }
}

export const commentController = new CommentController();
