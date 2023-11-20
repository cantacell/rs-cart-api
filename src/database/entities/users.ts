import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Carts} from "./carts";
import {Orders} from "./orders";

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    email: string;

    @Column({ type: 'text', nullable: true })
    password: string;

    @OneToMany(
        () => Orders,
        order => order.id,
    )
    orders: Orders[];

    @OneToMany(
        () => Carts,
        cart => cart.id,
    )
    carts: Carts[];
}