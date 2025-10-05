import { NextFunction, Request, Response } from "express";

import { RoleEnum } from "../enums/role.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.errors";
import { ITokenPayload } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

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
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        throw new ApiError("No token provided.", StatusCodesEnum.UNAUTHORIZED);
      }

      const accessToken = authorizationHeader.split(" ")[1];

      if (!accessToken) {
        throw new ApiError("No token provided.", StatusCodesEnum.UNAUTHORIZED);
      }

      const { refreshToken } = await tokenRepository.findByParams({
        accessToken,
      });

      if (!refreshToken) {
        throw new ApiError(
          "No refresh token provided.",
          StatusCodesEnum.FORBIDDEN,
        );
      }

      req.res.locals.tokenPayload = tokenService.verifyToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

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

  // public async isActive(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { email } = req.body as IAuth;
  //     const user = await userRepository.getByEmail(email);
  //
  //     if (!user.isActive) {
  //       throw new ApiError("No has permission", StatusCodesEnum.FORBIDDEN);
  //     }
  //
  //     next();
  //   } catch (e) {
  //     next(e);
  //   }
  // }
}

export const authMiddleware = new AuthMiddleware();
