import { NextFunction, Request, Response } from "express";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import {
  IOrderCreate,
  IOrderQuery,
  IOrderUpdate,
} from "../interfaces/order.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { orderService } from "../services/order.service";

class OrderController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any as IOrderQuery;
      const data = await orderService.getAll(query);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async getAllForExcel(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any as Partial<IOrderQuery>;
      const data = await orderService.getAllForExcel(query);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await orderService.getById(id);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = req.body as IOrderCreate;
      const data = await orderService.create(order);
      res.status(StatusCodesEnum.CREATED).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userId } = res.locals.tokenPayload as ITokenPayload;
      const order = req.body as IOrderUpdate;
      const data = await orderService.updateById(id, order, userId);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }
}

export const orderController = new OrderController();
