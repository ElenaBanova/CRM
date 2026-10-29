import joi from "joi";

import { BanActionEnum } from "../enums/ban-action.enum";

export class ParamsValidator {
  private static banAction = joi
    .string()
    .valid(...Object.values(BanActionEnum));

  public static banUnbanAction = joi.object({
    id: joi.string().required(),
    action: this.banAction.required(),
  });
}
