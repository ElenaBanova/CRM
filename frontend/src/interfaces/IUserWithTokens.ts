import {ITokenPair} from "@/interfaces/ITokenPair";
import {IUser} from "@/interfaces/IUser";

export interface IUserWithTokens {
    user: IUser;
    tokens: ITokenPair
}