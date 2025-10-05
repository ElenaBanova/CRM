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
}

type IUserDTO = Pick<IUser, "name" | "surname" | "email">;

export { IUser, IUserDTO };
