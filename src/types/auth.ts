import { type User } from '@/db/schema';

export type Session = {
  id: string;
  email: string;
};

export type AuthenticatedUser = User;
