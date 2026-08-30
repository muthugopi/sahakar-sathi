import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../lib/useOnlineStatus';

interface QueryBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  children: ReactNode;
}

export function QueryBoundary({ isLoading, isError, onRetry, children }: QueryBoundaryProps) {
  const { t } = useTranslation();
  const online = useOnlineStatus();

  if (isLoading) {
    return (
      <div className="section-shell my-4" role="status">
        <div className="flex items-center gap-3 text-muted">
          <span className="inline-flex gap-1.5">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-field" />
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-field/80 [animation-delay:120ms]" />
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-field/60 [animation-delay:240ms]" />
          </span>
          <span className="text-sm font-medium">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="section-shell my-8 border-clay/30 bg-[#fffaf7]" role="alert">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-clay">
          {online ? t('common.errorTitle') : t('common.offlineTitle')}
        </p>
        <p className="mt-2 text-sm text-muted">
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
