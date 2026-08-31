import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';
import { Icon } from '../components/Icon';

const SECTIONS = ['cooperative_law', 'pacs', 'financial_literacy', 'pmfby'] as const;
const PATHS: Record<(typeof SECTIONS)[number], string> = {
  cooperative_law: '/cooperative',
  pacs: '/pacs',
  financial_literacy: '/money',
  pmfby: '/pmfby',
};

export function KnowledgePage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero
        eyebrow={t('nav.resources')}
        title={t('knowledge.title')}
        lead={t('knowledge.intro')}
        size="large"
      />
      <div className="container-wide section-tight section-divide">
        <div className="border-t border-line">
          {SECTIONS.map((key, i) => (
            <Link key={key} to={PATHS[key]} className="big-link group">
              <span className="big-link__index">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="big-link__label">{t(`sections.${key}.title`)}</span>
                <span className="big-link__desc">{t(`sections.${key}.intro`)}</span>
              </span>
              <Icon name="chevron" className="big-link__arrow h-5 w-5" />
            </Link>
          ))}
        </div>

        <p className="mt-12 max-w-prose text-sm text-ink-2">{t('knowledge.sourceNote')}</p>
      </div>
    </>
  );
}
