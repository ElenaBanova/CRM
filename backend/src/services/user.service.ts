import { RoleEnum } from "../enums/role.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.errors";
import {
  IUser,
  IUserDTO,
  IUsersWithIndexAndLastLogin,
} from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getAll(): Promise<IUsersWithIndexAndLastLogin[]> {
    const users = await userRepository.getAll();

    if (!users) {
      return [];
    }

    return await Promise.all(
      users.map(async (user) => {
        const latestToken = await tokenRepository.findByParams({
          _userId: user._id,
        });

        return {
          ...user,
          lastLogin: latestToken?.createdAt || null,
        } as IUsersWithIndexAndLastLogin;
      }),
    );
  }

  public async create(user: IUserDTO): Promise<IUser> {
    await this.isEmailUnique(user.email);
    return await userRepository.create(user);
  }

  public async getById(id: string): Promise<IUser> {
    const user = await userRepository.getById(id);

    if (!user) {
      throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
    }

    return user;
  }

  public async updateById(id: string, user: Partial<IUser>): Promise<IUser> {
    const userInDb = await userRepository.getById(id);

    if (!userInDb) {
      throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
    }

    return await userRepository.updateById(id, user);
  }

  public async isEmailUnique(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);

    if (user) {
      throw new ApiError("User is already exists", StatusCodesEnum.BAD_REQUEST);
    }
  }

  public async roleUpdate(id: string): Promise<IUser> {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new ApiError("User not found", StatusCodesEnum.BAD_REQUEST);
    }

    if (user.role === RoleEnum.ADMIN) {
      return await userRepository.updateById(id, { role: RoleEnum.MANAGER });
    }

    return await userRepository.updateById(id, { role: RoleEnum.ADMIN });
  }

  public async blockUnblockUser(id: string, userId: string): Promise<IUser> {
    const user = await userRepository.getById(id);

    if (!user) {
      throw new ApiError("User not found", StatusCodesEnum.BAD_REQUEST);
    }

    if (id === userId) {
      throw new ApiError("No permitted", StatusCodesEnum.FORBIDDEN);
    }

    if (!user.isActive) {
      return await userService.updateById(id, {
        isActive: true,
        blockUser: false,
      });
    }

    return await userService.updateById(id, {
      isActive: false,
      blockUser: true,
    });
  }
}

export const userService = new UserService();
