import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/PageHero';

const SECTIONS = ['what', 'who', 'sources', 'limits'] as const;

/** An editorial article — a wide measure, hanging section headings. */
export function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero
        eyebrow={t('nav.about')}
        title={t('about.title')}
        lead={t('about.lead')}
        size="large"
      />

      <div className="container-wide section-tight section-divide">
        <div className="space-y-14 border-t border-line pt-14">
          {SECTIONS.map((s) => (
            <section
              key={s}
              className="grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-10"
            >
              <h2 className="font-display text-lg font-normal text-ink">
                {t(`about.${s}Heading`)}
              </h2>
              <div className="max-w-prose space-y-3 text-ink-2">
                <p>{t(`about.${s === 'sources' ? 'sources1' : s}`)}</p>
                {s === 'sources' && <p>{t('about.sources2')}</p>}
              </div>
            </section>
          ))}
        </div>

        <p className="inset mt-16 max-w-prose">{t('footer.disclaimer')}</p>
      </div>
    </>
  );
}
