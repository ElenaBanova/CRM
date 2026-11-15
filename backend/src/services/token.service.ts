import jwt from "jsonwebtoken";

import { config } from "../configs/config";
import { ActionTokenTypeEnum } from "../enums/ection-type.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.errors";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";

class TokenService {
  public generateTokens(payload: ITokenPayload): ITokenPair {
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_LIFETIME,
    });
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_LIFETIME,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public verifyToken(
    token: string,
    type: TokenTypeEnum | ActionTokenTypeEnum,
    passwordHash: string = "",
  ): ITokenPayload {
    try {
      let secret: string;

      switch (type) {
        case TokenTypeEnum.ACCESS:
          secret = config.JWT_ACCESS_SECRET;
          break;
        case TokenTypeEnum.REFRESH:
          secret = config.JWT_REFRESH_SECRET;
          break;
        case ActionTokenTypeEnum.ACTIVATE:
          secret = config.JWT_ACTIVATE_SECRET + passwordHash;
          break;
        case ActionTokenTypeEnum.RECOVERY:
          secret = config.JWT_RECOVERY_SECRET + passwordHash;
          break;
        default:
          throw new ApiError("Invalid token type", StatusCodesEnum.BAD_REQUEST);
      }

      return jwt.verify(token, secret) as ITokenPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new ApiError(
        "Invalid or expired token",
        StatusCodesEnum.UNAUTHORIZED,
      );
    }
  }

  public generateActionToken(
    payload: ITokenPayload,
    type: ActionTokenTypeEnum,
    passwordHash: string = "",
  ): string {
    let secret: string;
    let expiresIn: any;

    switch (type) {
      case ActionTokenTypeEnum.ACTIVATE:
        secret = config.JWT_ACTIVATE_SECRET;
        expiresIn = config.JWT_ACTIVATE_LIFETIME;
        break;
      case ActionTokenTypeEnum.RECOVERY:
        secret = config.JWT_RECOVERY_SECRET;
        expiresIn = config.JWT_RECOVERY_LIFETIME;
        break;
      default:
        throw new ApiError(
          "Invalid action token type",
          StatusCodesEnum.BAD_REQUEST,
        );
    }
    return jwt.sign(payload, secret + passwordHash, { expiresIn });
  }

  public decodeActionToken(token: string): ITokenPayload {
    const payload = jwt.decode(token) as ITokenPayload | null;

    if (!payload || !payload.userId) {
      throw new ApiError(
        "Invalid or expired link",
        StatusCodesEnum.UNAUTHORIZED,
      );
    }

    return payload;
  }

  public async isTokenExists(
    token: string,
    type: TokenTypeEnum,
  ): Promise<boolean> {
    const iTokenPromise = await tokenRepository.findByParams({ [type]: token });
    return !!iTokenPromise;
  }
}

export const tokenService = new TokenService();
