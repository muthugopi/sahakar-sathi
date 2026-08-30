import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from '../components/Breadcrumbs';

const SECTIONS = [
  { to: '/cooperative', key: 'cooperative_law' },
  { to: '/pacs', key: 'pacs' },
  { to: '/money', key: 'financial_literacy' },
  { to: '/pmfby', key: 'pmfby' },
] as const;

export function KnowledgePage() {
  const { t } = useTranslation();
  return (
    <div className="container-page max-w-prose">
      <Breadcrumbs trail={[{ label: t('nav.knowledge') }]} />
      <h1 className="text-3xl sm:text-4xl">{t('knowledge.title')}</h1>
      <p className="mt-4 text-lg text-muted">{t('knowledge.intro')}</p>

      <ul className="record-list mt-8">
        {SECTIONS.map((s) => (
          <li key={s.to}>
            <Link to={s.to} className="record-row">
              <span className="block text-lg font-semibold text-primary underline">
                {t(`sections.${s.key}.title`)}
              </span>
              <span className="mt-1 block text-muted">{t(`sections.${s.key}.intro`)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="inset mt-10">
        <p>{t('knowledge.sourceNote')}</p>
      </div>
    </div>
  );
}
