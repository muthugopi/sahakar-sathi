import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/auth';
import { ApiRequestError } from '../lib/api';
import { Field, inputClass } from '../components/Field';
import { ErrorSummary, type FieldError } from '../components/ErrorSummary';

export function SignInPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const from = location.state?.from ?? '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: FieldError[] = [];
    if (!identifier.trim()) found.push({ field: 'identifier', message: t('auth.err.identifier') });
    if (!password) found.push({ field: 'password', message: t('auth.err.password') });
    if (found.length) {
      setErrors(found);
      return;
    }
    setErrors([]);
    setBusy(true);
    try {
      await login({ identifier, password });
      navigate(from, { replace: true });
    } catch (err) {
      setErrors([
        { message: err instanceof ApiRequestError ? err.message : t('auth.signInError') },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-wide max-w-form pb-20 pt-16 sm:pt-24">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{t("auth.signInTitle")}</h1>

      <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
        <ErrorSummary errors={errors} />

        <Field id="identifier" label={t('auth.identifier')}>
          <input
            id="identifier"
            className={inputClass}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
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
          />
        </Field>

        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? t('common.loading') : t('auth.submitSignIn')}
        </button>
      </form>

      <p className="mt-8">
        <Link to="/register" className="font-bold">
          {t('auth.needAccount')}
        </Link>
      </p>
    </div>
  );
}
