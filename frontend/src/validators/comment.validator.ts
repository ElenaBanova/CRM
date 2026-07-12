import Joi from "joi";

export const commentValidatorSchema = Joi.object({
    comment: Joi.string().regex(/^[А-ЯЄЇІҐа-яєїіґA-Za-z0-9]{1,25}$/,).required(),
})