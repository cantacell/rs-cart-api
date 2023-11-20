import Joi from "joi";

export const OrderJOI = Joi.object({
    payment: Joi.object().required(),
    delivery: Joi.object().required(),
    comments: Joi.string(),
});