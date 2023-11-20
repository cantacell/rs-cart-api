import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Carts } from './carts';
import {Users} from "./users";

@Entity()
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    user_id: string;

    @Column({ type: 'uuid', nullable: false })
    cart_id: string;

    @Column({ type: 'json', nullable: false })
    payment: Record<string, unknown>;

    @Column({ type: 'json', nullable: false })
    delivery: Record<string, unknown>;

    @Column({ type: 'text', nullable: true })
    comments: string;

    @Column({ type: 'text', nullable: false })
    status: string;

    @Column({ type: 'integer', nullable: false })
    total: number;

    @OneToOne(
        () => Carts,
        cart => cart.id,
    )
    @JoinColumn({ name: 'cart_id' })
    cart: Carts;

    @ManyToOne(
        () => Users,
        user => user.id,
    )
    user: Users;
}