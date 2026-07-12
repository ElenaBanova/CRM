import joi from "joi";

import { RegexEnum } from "../enums/regex.enum";

export class GroupValidator {
  private static name = joi.string().regex(RegexEnum.GROUP);

  public static create = joi.object({
    name: this.name.required(),
  });
}
