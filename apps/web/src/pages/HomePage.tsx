import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal } from '../components/Reveal';
import { Icon } from '../components/Icon';

const EXPLORE: { to: string; key: string; label: string }[] = [
  { to: '/schemes', key: 'schemes', label: 'sections.schemes.title' },
  { to: '/cooperative', key: 'cooperative', label: 'sections.cooperative_law.title' },
  { to: '/pacs', key: 'pacs', label: 'sections.pacs.title' },
  { to: '/pmfby', key: 'pmfby', label: 'sections.pmfby.title' },
  { to: '/money', key: 'money', label: 'sections.financial_literacy.title' },
];

const STATS = ['stat1', 'stat2', 'stat3', 'stat4'] as const;

export function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      {/* 1 — HERO ------------------------------------------------------------ */}
      <section className="container-wide pb-24 pt-16 sm:pb-32 sm:pt-24 lg:pt-28">
        <div className="reveal is-revealed max-w-4xl">
          <p className="eyebrow">{t('home.hero.eyebrow')}</p>
          <h1 className="mt-5 font-display text-[2.75rem] leading-[1.04] tracking-tight text-ink sm:text-7xl lg:text-8xl">
            {t('home.hero.title')}
          </h1>
          <p className="measure-wide mt-7 text-lg text-ink-2 sm:text-xl">{t('home.hero.lead')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Link to="/assistant" className="btn-primary btn-block px-6 text-lg">
              {t('home.hero.primary')}
            </Link>
            <Link
              to="/schemes"
              className="inline-flex items-center gap-2 font-semibold text-ink no-underline hover:text-primary"
            >
              {t('home.hero.secondary')}
              <Icon name="chevron" className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <a
          href="#how"
          className="mt-20 hidden items-center gap-3 text-xs uppercase tracking-wider text-ink-2 no-underline hover:text-ink sm:inline-flex"
        >
          <span className="h-10 w-px bg-line" aria-hidden />
          {t('home.hero.scrollHint')}
        </a>
      </section>

      {/* 2 — THE PROBLEM --------------------------------------------------- */}
      <section id="how" className="section section-divide">
        <div className="container-wide">
          <Reveal className="measure-wide">
            <p className="eyebrow">{t('home.problem.eyebrow')}</p>
            <h2 className="mt-5 font-display text-3xl font-normal leading-[1.12] tracking-tight text-ink sm:text-5xl">
              {t('home.problem.title')}
            </h2>
          </Reveal>
          <Reveal className="measure mt-10 space-y-5 text-lg text-ink-2" delay={1}>
            <p>{t('home.problem.body1')}</p>
            <p>{t('home.problem.body2')}</p>
          </Reveal>
        </div>
      </section>

      {/* 3 — THE SOLUTION (asymmetric split) ----------------------------- */}
      <section className="section section-divide">
        <div className="container-wide grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">{t('home.solution.eyebrow')}</p>
              <h2 className="mt-5 font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
                {t('home.solution.title')}
              </h2>
              <p className="mt-6 text-ink-2">{t('home.solution.body')}</p>
            </div>
          </Reveal>
          <Reveal className="divide-y divide-line border-t border-line" delay={1}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="grid gap-1 py-7 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                <h3 className="font-display text-lg font-normal text-ink">
                  {t(`home.solution.point${n}Title`)}
                </h3>
                <p className="text-ink-2">{t(`home.solution.point${n}Body`)}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 4 — ASK THE ASSISTANT (conversation preview) ------------------- */}
      <section className="section section-divide">
        <div className="container-wide">
          <Reveal className="measure-wide">
            <p className="eyebrow">{t('home.convo.eyebrow')}</p>
            <h2 className="mt-5 font-display text-3xl font-normal tracking-tight text-ink sm:text-5xl">
              {t('home.convo.title')}
            </h2>
          </Reveal>

          <Reveal className="mt-12 max-w-2xl" delay={1}>
            <p className="eyebrow">{t('assistant.you')}</p>
            <p className="mt-2 rounded-xl bg-primary-tint/60 px-4 py-3 text-ink">
              {t('home.convo.userMsg')}
            </p>

            <div className="mt-6 rounded-xl border border-line bg-panel p-5 sm:p-6">
              <p className="eyebrow text-primary">{t('assistant.assistantName')}</p>
              <p className="mt-3 text-ink">{t('home.convo.answerLead')}</p>
              <ul className="mt-4 space-y-2.5">
                {[1, 2, 3].map((n) => (
                  <li key={n} className="flex items-start gap-3 text-ink">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    {t(`home.convo.check${n}`)}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-sm text-ink-2">
                <span className="font-semibold uppercase tracking-wider">
                  {t('home.convo.sourceLabel')}
                </span>{' '}
                · {t('home.convo.sourceName')}
              </p>
            </div>

            <Link to="/assistant" className="btn-primary mt-8">
              {t('home.convo.cta')}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 5 — EXPLORE KNOWLEDGE (big typographic list) ------------------ */}
      <section className="section section-divide">
        <div className="container-wide">
          <Reveal className="measure-wide">
            <p className="eyebrow">{t('home.explore.eyebrow')}</p>
            <h2 className="mt-5 font-display text-3xl font-normal tracking-tight text-ink sm:text-5xl">
              {t('home.explore.title')}
            </h2>
          </Reveal>

          <div className="mt-12 border-t border-line">
            {EXPLORE.map((item, i) => (
              <Reveal key={item.to} delay={i}>
                <Link to={item.to} className="big-link group">
                  <span className="big-link__index">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="big-link__label">{t(item.label)}</span>
                    <span className="big-link__desc">{t(`home.explore.${item.key}`)}</span>
                  </span>
                  <Icon name="chevron" className="big-link__arrow h-5 w-5" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — IMPACT (editorial statistics) ---------------------------- */}
      <section className="section section-divide">
        <div className="container-wide">
          <Reveal className="measure-wide">
            <p className="eyebrow">{t('home.impact.eyebrow')}</p>
            <h2 className="mt-5 font-display text-3xl font-normal tracking-tight text-ink sm:text-5xl">
              {t('home.impact.title')}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s} delay={i}>
                <p className="stat__value">{t(`home.impact.${s}Value`)}</p>
                <p className="stat__label">{t(`home.impact.${s}Label`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — FINAL CTA ---------------------------------------------- */}
      <section className="section-divide py-28 sm:py-40">
        <Reveal className="container-wide text-center">
          <h2 className="font-display text-2xl font-normal text-ink-2 sm:text-3xl">
            {t('home.finalCta.title')}
          </h2>
          <p className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-6xl">
            {t('home.finalCta.subtitle')}
          </p>
          <Link to="/assistant" className="btn-primary mt-10 px-8 text-lg">
            {t('home.finalCta.button')}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
