export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
