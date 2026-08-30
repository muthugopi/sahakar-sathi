import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/auth';
import { ApiRequestError } from '../lib/api';
import { Field, inputClass } from '../components/Field';

export function SignInPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const from = location.state?.from ?? '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login({ identifier, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : t('auth.signInError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-page max-w-lg py-12">
      <div className="section-shell p-6 sm:p-7">
        <h1 className="text-3xl tracking-[-0.05em] text-field-deep sm:text-4xl">{t('auth.signInTitle')}</h1>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          {error && (
            <p role="alert" className="rounded-2xl border border-clay/40 bg-clay/5 px-3 py-2 text-sm font-medium text-clay">
              {error}
            </p>
          )}

          <Field id="identifier" label={t('auth.identifier')}>
            <input
              id="identifier"
              className={inputClass}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>

          <Field id="password" label={t('auth.password')}>
            <input
              id="password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          <button type="submit" className="btn-primary mt-2" disabled={busy}>
            {busy ? t('common.loading') : t('auth.submitSignIn')}
          </button>
        </form>

        <Link to="/register" className="mt-6 inline-block text-sm font-medium text-field-deep underline hover:text-field">
          {t('auth.needAccount')}
        </Link>
      </div>
    </div>
  );
}
