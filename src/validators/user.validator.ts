import joi from "joi";

import { RegexEnum } from "../enums/regex.enum";

export class UserValidator {
  private static name = joi.string().regex(RegexEnum.NAME);
  private static surname = joi.string().regex(RegexEnum.NAME);
  private static email = joi.string().email();

  public static create = joi.object({
    name: this.name.required(),
    surname: this.surname.required(),
    email: this.email.required(),
  });

  public static update = joi.object({
    name: this.name,
    surname: this.surname,
    email: this.email,
  });
}
