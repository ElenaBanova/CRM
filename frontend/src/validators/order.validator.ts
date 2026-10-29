import Joi from "joi";

export const orderValidatorSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(30)
        .regex(/^[А-ЯЄЇІҐA-Z][А-ЯЄЇІҐа-яєїіґA-Za-z'’\- ]*$/)
        .messages({
            'string.pattern.base': 'Name must start with a capital letter and contain only letters, hyphen or apostrophe',
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name must be at most 30 characters',
        }),
    surname: Joi.string()
        .trim()
        .min(2)
        .max(30)
        .regex(/^[А-ЯЄЇІҐA-Z][А-ЯЄЇІҐа-яєїіґA-Za-z'’\- ]*$/)
        .messages({
            'string.pattern.base': 'Surname must start with a capital letter and contain only letters, hyphen or apostrophe',
            'string.min': 'Surname must be at least 2 characters',
            'string.max': 'Surname must be at most 30 characters',
        }),
    email: Joi.string().email().messages({
        "string.email": 'Must be a valid email'
    }),
    phone: Joi.string().regex(/(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/).messages({
        'string.pattern.base': 'Must be a valid phone'
    }),
    age: Joi.number().min(2).max(100).messages({
        'number.min': 'Minimum age: 2 years',
        'number.max': 'Maximum age: 100 years',
    }),
    sum: Joi.number().max(500000).messages({
        'string.max': 'Maximum sum: 500000',
    }),
    already_paid: Joi.number().max(500000).messages({
        'string.max': 'Maximum already paid: 500000',
    }),
})
