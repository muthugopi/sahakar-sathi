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
      <p className="py-12 text-center text-muted" role="status">
        {t('common.loading')}
      </p>
    );
  }

  if (isError) {
    return (
      <div className="my-8 rounded-lg border border-clay/40 bg-clay/5 p-5" role="alert">
        <p className="font-medium text-clay">
          {online ? t('common.errorTitle') : t('common.offlineTitle')}
        </p>
        <p className="mt-1 text-sm text-muted">
          {online ? t('content.loadError') : t('common.offlineBody')}
        </p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-outline mt-3">
            {t('common.retry')}
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
