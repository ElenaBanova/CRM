import { NextFunction, Request, Response } from "express";

import { ActionTokenTypeEnum } from "../enums/ection-type.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { authService } from "../services/auth.service";
import { tokenService } from "../services/token.service";
import { userService } from "../services/user.service";

class AuthController {
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IAuth;
      const data = await authService.signIn(dto);
      res.status(StatusCodesEnum.OK).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async me(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenPayload = res.locals.tokenPayload as ITokenPayload;
      const { userId } = tokenPayload;
      const user = await userService.getById(userId);
      res.status(StatusCodesEnum.OK).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.tokenPayload as ITokenPayload;
      const tokens = tokenService.generateTokens({ userId, role });
      await tokenRepository.create({ ...tokens, _userId: userId });
      res.status(StatusCodesEnum.OK).json({ tokens });
    } catch (e) {
      next(e);
    }
  }

  public async actionURL(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pathname = req.path.split("/");
      const type = pathname[1] as ActionTokenTypeEnum;
      const url = await authService.actionURL(id, type);
      res.status(StatusCodesEnum.OK).json(url);
    } catch (e) {
      next(e);
    }
  }

  public async passwordCreateOrRecovery(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token } = req.params;

      const pathname = req.path.split("/");
      const action = pathname[2] as string;
      let type: ActionTokenTypeEnum;

      if (action === "create") {
        type = ActionTokenTypeEnum.ACTIVATE;
      } else {
        type = ActionTokenTypeEnum.RECOVERY;
      }

      const { password } = req.body;

      await authService.passwordCreateOrRecovery(token, type, password);

      res.status(StatusCodesEnum.OK).json({ details: `Password ${type}` });
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
