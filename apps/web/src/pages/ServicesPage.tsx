import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';

const GROUPS = [
  { key: 'cooperative', links: [['/cooperative', 'sections.cooperative_law.title'], ['/pacs', 'sections.pacs.title']] },
  { key: 'schemes', links: [['/schemes', 'sections.schemes.title']] },
  { key: 'money', links: [['/money', 'sections.financial_literacy.title']] },
  { key: 'insurance', links: [['/pmfby', 'sections.pmfby.title']] },
  { key: 'law', links: [['/cooperative', 'sections.cooperative_law.title']] },
  { key: 'grievance', links: [['/grievance', 'grievance.title'], ['/track', 'grievance.trackTitle']] },
] as const;

export function ServicesPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero
        eyebrow={t('nav.services')}
        title={t('services.title')}
        lead={t('services.intro')}
        size="large"
      />
      <div className="container-wide section-tight section-divide max-w-prose">
        <div className="divide-y divide-line border-t border-line">
          {GROUPS.map((g) => (
            <section key={g.key} className="py-8">
              <h2 className="font-display text-xl font-normal text-ink">
                {t(`home.dir.${g.key}`)}
              </h2>
              <p className="mt-2 text-ink-2">{t(`services.desc.${g.key}`)}</p>
              <ul className="mt-3 space-y-1">
                {g.links.map(([to, labelKey]) => (
                  <li key={to + labelKey}>
                    <Link to={to} className="font-semibold">
                      {t(labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="inset-brand mt-12">
          <p>{t('services.assistantNote')}</p>
          <p className="mt-3">
            <Link to="/assistant" className="font-semibold">
              {t('nav.askAssistant')}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
