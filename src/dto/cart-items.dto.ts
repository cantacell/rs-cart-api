import Joi from "joi";

export const CartItemJOI = Joi.object({
    product_id: Joi.string().uuid({version: 'uuidv4'}).required(),
    count: Joi.number().min(0).required()
});
