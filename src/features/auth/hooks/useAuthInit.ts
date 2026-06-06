import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { refreshTokens } from '../api/authApi';

// Run once on app mount. Silently tries to exchange the HttpOnly refresh token
// cookie for a fresh access token. On success the user is considered authenticated
// without ever having to re-enter credentials. On failure (no cookie, expired,
// revoked) the app transitions to 'unauthenticated' and shows the login page.
export function useAuthInit() {
  const login = useAuthStore((state) => state.login);
  const markUnauthenticated = useAuthStore(
    (state) => state.markUnauthenticated,
  );

  useEffect(() => {
    let cancelled = false;

    refreshTokens()
      .then(({ accessToken, user }) => {
        if (!cancelled) login(accessToken, user);
      })
      .catch(() => {
        if (!cancelled) markUnauthenticated();
      });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
