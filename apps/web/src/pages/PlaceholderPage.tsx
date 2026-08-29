import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Temporary page for routes whose milestone has not landed yet. */
export function PlaceholderPage({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation();
  return (
    <div className="container-page py-16">
      <p className="eyebrow">{t(titleKey)}</p>
      <h1 className="mt-3 text-2xl">{t('common.comingSoon')}</h1>
      <Link to="/" className="btn-outline mt-6">
        {t('common.backHome')}
      </Link>
    </div>
  );
}
