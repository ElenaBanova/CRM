import { IToken, ITokenDTO } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public create(dto: ITokenDTO): Promise<IToken> {
    return Token.create(dto);
  }

  public findByParams(param: Partial<IToken>): Promise<IToken> {
    return Token.findOne(param);
  }

  // public async deleteBeforeDate(date: Date): Promise<number> {
  //   const result = await Token.deleteMany({ createdAt: { $lt: date } });
  //   return result.deletedCount;
  // }
}

export const tokenRepository = new TokenRepository();
