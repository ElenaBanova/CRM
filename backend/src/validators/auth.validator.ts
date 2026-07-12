import joi from "joi";

import { RegexEnum } from "../enums/regex.enum";

export class AuthValidator {
  private static email = joi.string().email();
  private static password = joi.string().regex(RegexEnum.PASSWORD);
  private static refresh = joi.string().trim();

  public static validateEmail = joi.object({
    email: this.email.required(),
  });

  public static validatePassword = joi.object({
    password: this.password.required(),
  });

  public static signIn = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  public static refreshToken = joi.object({
    refreshToken: this.refresh.required(),
  });
}
