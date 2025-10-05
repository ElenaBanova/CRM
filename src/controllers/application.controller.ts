import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import {
  IApplicationCreate,
  IApplicationQuery,
} from "../interfaces/application.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { applicationService } from "../services/application.service";

class ApplicationController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any as IApplicationQuery;
      const data = await applicationService.getAll(query);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await applicationService.getById(id);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const application = req.body as IApplicationCreate;
      const data = await applicationService.create(application);
      res.status(StatusCodesEnum.CREATED).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userId } = res.locals.tokenPayload as ITokenPayload;
      const application = req.body as Partial<IApplicationCreate>;
      const data = await applicationService.updateById(id, application, userId);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }
}

export const applicationController = new ApplicationController();
