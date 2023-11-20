import Joi from "joi";
import {CartItemJOI} from "./cart-items.dto";

export const CartJOI = Joi.object({
    cartItems: Joi.array().items(CartItemJOI)
});