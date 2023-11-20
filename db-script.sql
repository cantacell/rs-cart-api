CREATE SCHEMA public;
COMMENT ON SCHEMA public IS 'standard public schema';

CREATE TYPE public.status AS ENUM (
    'OPEN',
    'ORDERED'
    );


SET default_tablespace = '';

SET default_table_access_method = heap;


CREATE TABLE public.cart_items (
                                   cart_id uuid NOT NULL,
                                   product_id uuid,
                                   count integer,
                                   id uuid NOT NULL
);


CREATE TABLE public.carts (
                              id uuid NOT NULL,
                              user_id uuid NOT NULL,
                              created_at date NOT NULL,
                              updated_at date NOT NULL,
                              status public.status
);


CREATE TABLE public.orders (
                               id uuid NOT NULL,
                               user_id uuid,
                               cart_id uuid NOT NULL,
                               payment json,
                               delivery json,
                               comments text,
                               total numeric,
                               status text
);


CREATE TABLE public.users (
                              id uuid NOT NULL,
                              name text,
                              email text,
                              password text
);


INSERT INTO public.cart_items VALUES ('788570e4-91d4-4cab-b9fb-77544ec36103', '510c878e-3776-4f69-b2b4-95ce0d47dc17', 2, '6c4707ab-756b-4ee8-a853-9e5ccb8002a7');
INSERT INTO public.cart_items VALUES ('788570e4-91d4-4cab-b9fb-77544ec36103', '8f531b4b-a9cc-434b-a5a7-1bd4634499fc', 1, 'ea2f0df9-d485-499a-bc1f-b473e85f3f04');

INSERT INTO public.carts VALUES ('788570e4-91d4-4cab-b9fb-77544ec36103', '37032014-b19e-466f-b987-99c4b7da7094', '2023-11-20', '2023-11-20', 'OPEN');

INSERT INTO public.users VALUES ('37032014-b19e-466f-b987-99c4b7da7094', NULL, NULL, NULL);

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_id_fk FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


ALTER TABLE ONLY public.orders
    ADD CONSTRAINT order_cart_id_fk FOREIGN KEY (cart_id) REFERENCES public.carts(id);


ALTER TABLE ONLY public.orders
    ADD CONSTRAINT order_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);

