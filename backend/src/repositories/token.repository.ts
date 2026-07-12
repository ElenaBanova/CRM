import { IToken, ITokenDTO } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public create(dto: ITokenDTO): Promise<IToken> {
    return Token.create(dto);
  }

  public findByParams(param: Partial<IToken>): Promise<IToken> {
    if (param._userId) {
      return Token.findOne(param).sort({ createdAt: -1 });
    }
    return Token.findOne(param);
  }
}

export const tokenRepository = new TokenRepository();
