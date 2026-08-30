import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../lib/useOnlineStatus';

interface QueryBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  children: ReactNode;
}

/** Consistent loading / error / offline states for data-backed pages. */
export function QueryBoundary({ isLoading, isError, onRetry, children }: QueryBoundaryProps) {
  const { t } = useTranslation();
  const online = useOnlineStatus();

  if (isLoading) {
    return (
      <p className="py-8 text-muted" role="status">
        {t('common.loading')}
      </p>
    );
  }

  if (isError) {
    return (
      <div className="my-6 border-l-4 border-clay ps-4" role="alert">
        <h2 className="text-lg font-bold text-ink">
          {online ? t('common.errorTitle') : t('common.offlineTitle')}
        </h2>
        <p className="mt-1 text-muted">
          {online ? t('content.loadError') : t('common.offlineBody')}
        </p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-secondary mt-4">
            {t('common.retry')}
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
