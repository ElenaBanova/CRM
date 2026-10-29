import Joi from "joi";

export const commentValidatorSchema = Joi.object({
    comment: Joi.string().trim().max(100).required()
})