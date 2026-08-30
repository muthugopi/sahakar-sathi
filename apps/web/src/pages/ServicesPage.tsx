import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from '../components/Breadcrumbs';

const GROUPS = [
  {
    key: 'cooperative',
    links: [
      ['/cooperative', 'sections.cooperative_law.title'],
      ['/pacs', 'sections.pacs.title'],
    ],
  },
  { key: 'schemes', links: [['/schemes', 'sections.schemes.title']] },
  { key: 'money', links: [['/money', 'sections.financial_literacy.title']] },
  { key: 'insurance', links: [['/pmfby', 'sections.pmfby.title']] },
  { key: 'law', links: [['/cooperative', 'sections.cooperative_law.title']] },
  {
    key: 'grievance',
    links: [
      ['/grievance', 'grievance.title'],
      ['/track', 'grievance.trackTitle'],
    ],
  },
] as const;

export function ServicesPage() {
  const { t } = useTranslation();
  return (
    <div className="container-page max-w-prose">
      <Breadcrumbs trail={[{ label: t('nav.services') }]} />
      <h1 className="text-3xl sm:text-4xl">{t('services.title')}</h1>
      <p className="mt-4 text-lg text-muted">{t('services.intro')}</p>

      <div className="mt-10 space-y-8">
        {GROUPS.map((g) => (
          <section key={g.key} className="border-t border-line pt-6">
            <h2 className="text-xl">{t(`home.dir.${g.key}`)}</h2>
            <p className="mt-2 text-muted">{t(`services.desc.${g.key}`)}</p>
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

      <div className="inset-brand mt-10">
        <p>{t('services.assistantNote')}</p>
        <p className="mt-3">
          <Link to="/assistant" className="font-semibold">
            {t('nav.askAssistant')}
          </Link>
        </p>
      </div>
    </div>
  );
}
