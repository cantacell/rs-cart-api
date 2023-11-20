import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { CartItems } from './cartItems';
import {Users} from "./users";

@Entity()
export class Carts {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(
        () => CartItems,
        cartItem => cartItem.cart,
        {cascade: true, eager: true}
    )
    items: CartItems[];

    @Column('uuid')
    user_id: string;

    @ManyToOne(
        () => Users,
        user => user.carts
    )
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: Users;

    @Column('date', {nullable: false})
    created_at: Date;

    @Column('date', {nullable: false})
    updated_at: Date;

    @Column()
    status: 'OPEN' | 'ORDERED';
}