import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.errors";
import { ITokenPayload } from "../interfaces/token.interface";
import { orderService } from "../services/order.service";

class CommonMiddleware {
  public isIdValidate(key: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params[key];
        if (!isObjectIdOrHexString(id)) {
          throw new ApiError(
            `Invalid ${key}: ${id}`,
            StatusCodesEnum.BAD_REQUEST,
          );
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public validateBody(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await validator.validateAsync(req.body);
        next();
      } catch (e) {
        next(new ApiError(e.details[0].message, 400));
      }
    };
  }

  public query(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.query = await validator.validateAsync(req.query);
        next();
      } catch (e) {
        next(new ApiError(e.details[0].message, 400));
      }
    };
  }

  public managerValid(idOrder: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = res.locals.tokenPayload as ITokenPayload;
        const id = req.params[idOrder];
        const { manager } = await orderService.getById(id);
        if (manager) {
          const managerId = manager.valueOf();

          if (managerId) {
            if (userId !== managerId) {
              throw new ApiError(
                "No has permission",
                StatusCodesEnum.FORBIDDEN,
              );
            }
          }
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
