import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="container-page max-w-prose">
      <Breadcrumbs trail={[{ label: t('nav.about') }]} />
      <h1 className="text-3xl sm:text-4xl">{t('about.title')}</h1>

      <p className="mt-4 text-lg text-ink-2">{t('about.lead')}</p>

      <h2 className="mt-10 text-xl">{t('about.whatHeading')}</h2>
      <p className="mt-2 text-ink-2">{t('about.what')}</p>

      <h2 className="mt-8 text-xl">{t('about.whoHeading')}</h2>
      <p className="mt-2 text-ink-2">{t('about.who')}</p>

      <h2 className="mt-8 text-xl">{t('about.sourcesHeading')}</h2>
      <p className="mt-2 text-ink-2">{t('about.sources1')}</p>
      <p className="mt-3 text-ink-2">{t('about.sources2')}</p>

      <h2 className="mt-8 text-xl">{t('about.limitsHeading')}</h2>
      <p className="mt-2 text-ink-2">{t('about.limits')}</p>

      <p className="inset mt-10">{t('footer.disclaimer')}</p>
    </div>
  );
}
