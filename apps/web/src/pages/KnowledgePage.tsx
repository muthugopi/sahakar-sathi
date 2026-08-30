import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Signpost } from '../components/Signpost';

const SECTIONS = [
  { to: '/cooperative', key: 'cooperative_law', icon: 'knowledge' },
  { to: '/pacs', key: 'pacs', icon: 'services' },
  { to: '/money', key: 'financial_literacy', icon: 'scheme' },
  { to: '/pmfby', key: 'pmfby', icon: 'grievance' },
] as const;

export function KnowledgePage() {
  const { t } = useTranslation();
  return (
    <div className="container-page max-w-prose">
      <Breadcrumbs trail={[{ label: t('nav.knowledge') }]} />
      <h1 className="text-3xl sm:text-4xl">{t('knowledge.title')}</h1>
      <p className="mt-4 text-lg text-ink-2">{t('knowledge.intro')}</p>

      <div className="signpost-list mt-7">
        {SECTIONS.map((s) => (
          <Signpost
            key={s.to}
            to={s.to}
            icon={s.icon}
            label={t(`sections.${s.key}.title`)}
            sub={t(`sections.${s.key}.intro`)}
          />
        ))}
      </div>

      <div className="notice mt-8">
        <p>{t('knowledge.sourceNote')}</p>
      </div>
    </div>
  );
}
