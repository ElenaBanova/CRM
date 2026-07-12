import { NextFunction, Request, Response } from "express";

import { RoleEnum } from "../enums/role.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.errors";
import { IRefreshToken, ITokenPayload } from "../interfaces/token.interface";
import { tokenService } from "../services/token.service";
import { userService } from "../services/user.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        throw new ApiError("No token provided.", StatusCodesEnum.UNAUTHORIZED);
      }

      const accessToken = authorizationHeader.split(" ")[1];

      if (!accessToken) {
        throw new ApiError("No token provided.", StatusCodesEnum.UNAUTHORIZED);
      }

      const tokenPayload = tokenService.verifyToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      const isToKenExist = await tokenService.isTokenExists(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      if (!isToKenExist) {
        throw new ApiError("Invalid token.", StatusCodesEnum.UNAUTHORIZED);
      }

      req.res.locals.tokenPayload = tokenPayload;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { refreshToken } = req.body as IRefreshToken;

      if (!refreshToken) {
        throw new ApiError(
          "No refresh token provided",
          StatusCodesEnum.FORBIDDEN,
        );
      }
      const tokenPayload = tokenService.verifyToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
      const isTokenExists = await tokenService.isTokenExists(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      if (!isTokenExists) {
        throw new ApiError("Invalid token", StatusCodesEnum.FORBIDDEN);
      }

      req.res.locals.tokenPayload = tokenPayload;

      next();
    } catch (e) {
      next(e);
    }
  }

  public isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = res.locals.tokenPayload as ITokenPayload;

      if (role !== RoleEnum.ADMIN) {
        throw new ApiError("No has permission", StatusCodesEnum.FORBIDDEN);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.tokenPayload as ITokenPayload;

      const user = await userService.getById(userId);

      if (user.blockUser === true) {
        throw new ApiError("Account is blocked", StatusCodesEnum.FORBIDDEN);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
