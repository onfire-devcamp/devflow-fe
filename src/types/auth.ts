export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  workplace?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
