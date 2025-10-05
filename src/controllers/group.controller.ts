import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IGroupCreate } from "../interfaces/group.interface";
import { groupService } from "../services/group.service";

class GroupController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await groupService.getAll();
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await groupService.getById(id);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const group = req.body as IGroupCreate;
      const data = await groupService.create(group);
      res.status(StatusCodesEnum.CREATED).json(data);
    } catch (e) {
      next(e);
    }
  }
}

export const groupController = new GroupController();
