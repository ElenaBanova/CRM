import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";

interface IUser extends IBase {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: RoleEnum;
  isActive: boolean;
  blockUser: boolean;
}

interface IUserWithIndex extends IBase {
  rowNumber: number;
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: RoleEnum;
  isActive: boolean;
  blockUser: boolean;
}

interface IUsersWithIndexAndLastLogin extends IBase {
  // total: number;
  lastLogin: Date;
  rowNumber: number;
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: RoleEnum;
  isActive: boolean;
  blockUser: boolean;
}

type IUserDTO = Pick<IUser, "name" | "surname" | "email">;

export { IUser, IUserDTO, IUsersWithIndexAndLastLogin, IUserWithIndex };
