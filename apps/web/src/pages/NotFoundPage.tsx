import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="container-wide max-w-prose py-28 sm:py-40">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
        {t('common.errorTitle')}
      </h1>
      <p className="mt-5 text-lg text-ink-2">{t('common.notFoundBody')}</p>
      <p className="mt-8">
        <Link to="/" className="btn-primary">
          {t('common.backHome')}
        </Link>
      </p>
    </div>
  );
}
