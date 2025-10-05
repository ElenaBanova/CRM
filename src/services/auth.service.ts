import { config } from "../configs/config";
import { ActionTokenTypeEnum } from "../enums/ection-type.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.errors";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPair } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
  public async signIn(
    dto: IAuth,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByEmail(dto.email);

    if (!user) {
      throw new ApiError(
        "Invalid email or password",
        StatusCodesEnum.UNAUTHORIZED,
      );
    }
    const isValidPassword = await passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new ApiError(
        "Invalid email or password",
        StatusCodesEnum.UNAUTHORIZED,
      );
    }

    if (!user.isActive) {
      throw new ApiError("Account is not active", StatusCodesEnum.FORBIDDEN);
    }

    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });
    return { user, tokens };
  }

  public async actionURL(
    id: string,
    type: ActionTokenTypeEnum,
  ): Promise<string> {
    const user = await userService.getById(id);

    if (!user) {
      throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
    }

    const actionToken = tokenService.generateActionToken(
      {
        userId: user._id,
        role: user.role,
      },
      type,
    );
    await userService.updateById(id, { isActive: true });

    return `${config.FRONTEND_URL}/${type}/${actionToken}`;
  }

  public async passwordCreateOrRecovery(
    token: string,
    type: ActionTokenTypeEnum,
    password: string,
  ): Promise<void> {
    const { userId } = tokenService.verifyToken(token, type);

    const hashedPassword = await passwordService.hashPassword(password);
    await userService.updateById(userId, {
      password: hashedPassword,
    });
  }
}

export const authService = new AuthService();
