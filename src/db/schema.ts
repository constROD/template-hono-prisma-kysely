import { type products, type users } from '@prisma/client';
import { type DB } from './types';

export interface Tables {
  users: users;
  products: products;
}

export type KyselySchema = DB;
