import Joi from "joi";

export const groupValidatorSchema = Joi.object({
    name: Joi.string().regex(/^[А-ЯЄЇІҐа-яєїіґA-Za-z0-9\s\-_]{2,10}$/i).messages({
        'string.pattern.base': 'Invalid characters in the group name. Cannot save.'
    })
})