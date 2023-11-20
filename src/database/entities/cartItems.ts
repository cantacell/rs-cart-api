import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Carts} from "./carts";

@Entity()
export class CartItems {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', {nullable: false})
    cart_id: string;

    @ManyToOne(
        () => Carts,
        cart => cart.items,
        {onDelete: 'CASCADE', onUpdate: 'CASCADE', orphanedRowAction: 'delete'}
    )
    cart: Carts;

    @Column('uuid')
    product_id: string;

    @Column({ type: 'integer', nullable: false })
    count: number;
}