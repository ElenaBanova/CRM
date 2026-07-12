import Joi from "joi";

export const loginValidatorSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().regex(/^[А-ЯЄЇІҐа-яєїіґA-Za-z]{1,9}\S$/).required().messages({
        'string.pattern.base': 'Name must start with capital letter (2-10 chars)'
    }),
    surname: Joi.string().regex(/^[А-ЯЄЇІҐа-яєїіґA-Za-z]{1,9}\S$/).required().messages({
        'string.pattern.base': 'Surname must start with capital letter (2-10 chars)'
    }),
})
