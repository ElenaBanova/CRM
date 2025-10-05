import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";

interface IToken extends IBase {
  _id: string;
  accessToken: string;
  refreshToken: string;
  _userId: string;
}

type ITokenDTO = Pick<IToken, "accessToken" | "refreshToken" | "_userId">;

interface ITokenPayload {
  userId: string;
  role: RoleEnum;
}

type ITokenPair = Pick<IToken, "accessToken" | "refreshToken">;

export { IToken, ITokenDTO, ITokenPair, ITokenPayload };
