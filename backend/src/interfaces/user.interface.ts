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

interface IStatistic {
  total: number;
  inWork: number;
  agree: number;
  disagree: number;
  dubbing: number;
  new: number;
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
  statistic: IStatistic;
}

interface IUserQuery {
  pageSize: number;
  page: number;
}

export interface IResponseUsers {
  users: IUsersWithIndexAndLastLogin[];
  totalItems: number;
  totalStatistic: IStatistic;
}

type IUserDTO = Pick<IUser, "name" | "surname" | "email">;

export { IStatistic, IUser, IUserDTO, IUserQuery, IUsersWithIndexAndLastLogin };
