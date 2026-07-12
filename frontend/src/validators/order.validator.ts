import Joi from "joi";

export const orderValidatorSchema = Joi.object({
    name: Joi.string().regex(/^[А-ЯЄЇІҐа-яєїіґA-Za-z]{1,9}\S$/).messages({
        'string.pattern.base': 'Name must start with capital letter (2-10 chars)'
    }),
    surname: Joi.string().regex(/^[А-ЯЄЇІҐа-яєїіґA-Za-z]{1,9}\S$/).messages({
        'string.pattern.base': 'Surname must start with capital letter (2-10 chars)'
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
    sum: Joi.number().min(1).max(500000).messages({
        'string.min': 'Minimum sum: 1',
        'string.max': 'Maximum sum: 500000',
    }),
    already_paid: Joi.number().min(1).max(500000).messages({
        'string.min': 'Minimum already paid: 1',
        'string.max': 'Maximum already paid: 500000',
    }),
})
