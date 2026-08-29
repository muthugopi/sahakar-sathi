import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="container-page py-16">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-2xl">{t('common.errorTitle')}</h1>
      <Link to="/" className="btn-primary mt-6">
        {t('common.backHome')}
      </Link>
    </div>
  );
}
