import { type ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
    | string
    | undefined;
  if (!googleClientId) {
    throw new Error(
      'Missing required environment variable: VITE_GOOGLE_CLIENT_ID',
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
