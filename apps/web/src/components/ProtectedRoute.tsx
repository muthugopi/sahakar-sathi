import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { UserRole } from '@sahakar/shared';
import { useAuth } from '../lib/auth';

/**
 * Gate a route on authentication and (optionally) role. While the initial
 * silent refresh is in flight we show a calm loading state rather than
 * bouncing the user to sign-in.
 */
export function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: UserRole[];
}) {
  const { status, user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (status === 'loading') {
    return <div className="container-page py-16 text-ink-2">{t('common.loading')}</div>;
  }

  if (status === 'anonymous' || !user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
