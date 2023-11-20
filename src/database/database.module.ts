import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategy';
import { Carts } from './entities/carts';
import { CartItems }  from './entities/cartItems';
import { Orders} from './entities/orders';
import { Users } from './entities/users';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: `${process.env.DB_HOST}`,
            port: +`${process.env.DB_PORT}`,
            database: `${process.env.DB_NAME}`,
            username: `${process.env.DB_USERNAME}`,
            password: `${process.env.DB_PASSWORD}`,
            entities: [Carts, CartItems, Orders, /*Product,*/ Users],
            // logging: true,
            namingStrategy: new SnakeNamingStrategy(),
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        }),
        TypeOrmModule.forFeature([Carts, CartItems, Orders, /*Product,*/ Users]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}