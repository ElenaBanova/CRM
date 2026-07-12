import joi from "joi";

import { RegexEnum } from "../enums/regex.enum";

export class CommentValidator {
  private static comment = joi.string().regex(RegexEnum.COMMENT);

  public static create = joi.object({
    comment: this.comment.required(),
  });
}
