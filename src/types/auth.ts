import { type UserRoleType } from '@/db/types';

export type Session = {
  id: string;
  role: UserRoleType;
  email: string;
};
