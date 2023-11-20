import { Injectable } from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { DataSource } from 'typeorm';
import { Carts } from '../../database/entities/carts';

import axios from 'axios';
import {CartItem, Product} from "../models";
import {CartItems} from "../../database/entities/cartItems";
import {Users} from "../../database/entities/users";

@Injectable()
export class CartService {
  constructor(
      @InjectRepository(Carts)
      private readonly userCarts: Repository<Carts>,
      @InjectRepository(Users)
      private readonly users: Repository<Users>,
      private dataSource: DataSource
  ) {}

  async findByUserId(userId: string): Promise<Carts> {
    // Use only one query
    return this.userCarts.createQueryBuilder("carts")
        .leftJoinAndSelect("carts.items", "item")/*.distinct()*/
        .where("carts.user_id = :userId", {userId})
        .andWhere("carts.status = :status", {status: 'OPEN'})
        .getOne();

    // Use 2 queries
    // return this.userCarts.findOneBy({user_id: userId}); // TODO add where for only 'open' cart
  }

  async createByUserId(userId: string) {
    const id = randomUUID();

    return await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
      if (!userId || userId === '') {
        const newUser: Users = new Users();
        newUser.id = randomUUID();
        userId = newUser.id;
        await transactionalEntityManager.save(Users, newUser);
      }
      const userCart: Partial<Carts> = {
        id,
        items: [],
        created_at: new Date(),
        updated_at: new Date(),
        status: 'OPEN',
        user_id: userId,
      };
      return (await transactionalEntityManager.save(Carts, userCart)) as Carts;
    })
  }

  async getProductsByCartItems(cartItems: CartItems[]) {
    for (const item of cartItems) {
      const product = await this.getProductById(item.product_id);
      if (product)
        (item as unknown as CartItem).product = product;
    }
    // Remove items that contain not existing products
    return cartItems.filter(item => (item as unknown as CartItem).product);
  }

  async findOrCreateByUserId(userId: string): Promise<Carts> {
    if (userId) {
      const userCart = await this.findByUserId(userId);

      if (userCart) {
        userCart.items = await this.getProductsByCartItems(userCart.items);
        return userCart;
      }
    }

    return this.createByUserId(userId);
  }

  async getProductById(productId: string) {
    try {
      console.log('retrieving productId: ' + productId);
      const data = await axios.get(process.env.PRODUCT_API + productId);
      console.log('product retrieved ', data.data.product);
      return data.data.product as Product;
    } catch (e) {
      console.log('error retrieving productId ' + productId);
      return undefined;
    }
  }

  async updateByUserId(userId: string, items: {product_id: string; count: number;}[]): Promise<Carts> {
    const cart = await this.findOrCreateByUserId(userId);

    const cartItems = items.map((ci: Partial<CartItems>) => {
      ci.id = randomUUID();
      ci.cart_id = cart.id;
      return ci;
    });
    cart.items = [ ...(cartItems as Partial<CartItems[]>)];

    await this.userCarts.save(cart);
    return this.findOrCreateByUserId(userId);
  }

  async removeByUserId(userId) {
    return this.userCarts.delete({user_id: userId, status: 'OPEN'});
  }

  async updateCartStatusByUserId(cart: Carts) {
    cart.status = 'ORDERED';
    return this.userCarts.save(cart);
  }
}
