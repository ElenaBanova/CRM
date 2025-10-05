import { RoleEnum } from "../enums/role.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.errors";
import { IUser, IUserDTO } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public getAll(): Promise<IUser[]> {
    return userRepository.getAll();
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

  public async deleteById(id: string): Promise<void> {
    const userInDb = await userRepository.getById(id);

    if (!userInDb) {
      throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
    }

    return await userRepository.deleteById(id);
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

  public async isActiveUpdate(id: string): Promise<IUser> {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new ApiError("User not found", StatusCodesEnum.BAD_REQUEST);
    }

    if (!user.isActive) {
      return await userService.updateById(id, { isActive: true });
    }

    return await userService.updateById(id, { isActive: false });
  }
}

export const userService = new UserService();
