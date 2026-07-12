import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ICommentNew } from "../interfaces/comment.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { commentService } from "../services/comment.service";

class CommentController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await commentService.getAll(id);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userId } = res.locals.tokenPayload as ITokenPayload;
      const { comment: newComment } = req.body as ICommentNew;
      const comment = await commentService.create({
        comment: newComment,
        _userId: userId,
        _idOrder: id,
      });
      res.status(StatusCodesEnum.CREATED).json(comment);
    } catch (e) {
      next(e);
    }
  }
}

export const commentController = new CommentController();
