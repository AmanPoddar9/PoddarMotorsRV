import { useEffect, useState } from 'react';

/**
 * Hook that fetches the current user (id & role) from /api/auth/me.
 * It returns { user, loading } where:
 *   - user = { id, role } or null if not authenticated
 *   - loading = true while the request is in flight
 */
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // `credentials: 'include'` sends the httpOnly auth cookie
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
