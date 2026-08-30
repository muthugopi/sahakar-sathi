import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="container-page max-w-prose">
      <h1 className="text-3xl sm:text-4xl">{t('common.errorTitle')}</h1>
      <p className="mt-4 text-muted">{t('common.notFoundBody')}</p>
      <p className="mt-6">
        <Link to="/" className="btn-primary">
          {t('common.backHome')}
        </Link>
      </p>
    </div>
  );
}
