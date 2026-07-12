import Joi from "joi";

export const passwordValidatorSchema = Joi.object({
    password: Joi.string().required().regex(/^[\s\S]{5,15}$/).messages({
        'string.pattern.base': 'The password must be 5-15 characters long, contain at least one uppercase letter, one lowercase letter, one number, and no spaces.'
    }),
    confirmPassword: Joi.string().required().regex(/^[\s\S]{5,15}$/).messages({
        'string.pattern.base': 'The password must be 5-15 characters long, contain at least one uppercase letter, one lowercase letter, one number, and no spaces.'
    })
})