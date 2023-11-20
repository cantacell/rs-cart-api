import {Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus, UsePipes} from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import {Cart} from "./models";
import {JoiValidationPipe} from "../dto/joi-validation.pipe";
import {CartJOI} from "../dto/cart.dto";
import {OrderJOI} from "../dto/order.dto";

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    console.log('findUserCart', req);
    const cart = await this.cartService.findOrCreateByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart as unknown as Cart) },
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  @UsePipes(new JoiValidationPipe(CartJOI))
  async updateUserCart(@Req() req: AppRequest, @Body() body: {cartItems: Array<{product_id: string; count: number;}>}) {
    console.log('updateUserCart', req, body);
    const cart = await this.cartService.updateByUserId(getUserIdFromRequest(req), body.cartItems)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(cart as unknown as Cart),
      }
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    console.log('updateUserCart', req);
    await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Post('checkout')
  @UsePipes(new JoiValidationPipe(OrderJOI))
  async checkout(@Req() req: AppRequest, @Body() body: {
    payment: object,
    delivery: object,
    comments: string}) {
    console.log('checkout', req, body);
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findOrCreateByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart as unknown as Cart);
    const order = await this.orderService.create({
      ...body, // TODO: validate and pick only necessary data
      user_id: userId,
      cart_id: cartId,
      items,
      total,
    });
    // Update the cart with status 'ORDERED'
    await this.cartService.updateCartStatusByUserId(cart);
    // this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
