export type Role = 'USER' | 'ADMIN';

export type SerieStatus = 'ONGOING' | 'FINISHED' | 'CANCELED' | 'UPCOMING';

export interface JwtPayload {
  userId: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}
