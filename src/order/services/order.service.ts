import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { Order } from '../models';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Orders} from "../../database/entities/orders";
import {CartItems} from "../../database/entities/cartItems";

@Injectable()
export class OrderService {
  constructor(
      @InjectRepository(Orders)
      private readonly orders: Repository<Orders>,
  ) {}

  findById(orderId: string): Order {
    return this.orders[ orderId ];
  }

  async create(data: {
      payment: object,
      delivery: object,
      comments: string,
      user_id: string,
      cart_id: string,
      items: CartItems[],
      total: number}) {
    const id = randomUUID();
    const order = {
      ...data,
      id,
      status: 'inProgress',
    };

    return await this.orders.save(order);
  }

  update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orders[ orderId ] = {
      ...data,
      id: orderId,
    }
  }
}
