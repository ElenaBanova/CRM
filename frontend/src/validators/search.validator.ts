import Joi from "joi";

export const searchValidatorSchema = Joi.object({
    name: Joi.string().trim(),
    surname: Joi.string().trim(),
    email: Joi.string().trim(),
    phone: Joi.string().trim(),
    age: Joi.number(),
    dateFrom: Joi.string().isoDate().allow(''),
    dateTo: Joi.string().isoDate().allow(''),
})