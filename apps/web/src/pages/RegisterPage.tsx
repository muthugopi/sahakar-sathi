import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SELF_ASSIGNABLE_ROLES, SUPPORTED_LANGUAGES } from '@sahakar/shared';
import type { LanguageCode, RegisterInput, UserRole } from '@sahakar/shared';
import { useAuth } from '../lib/auth';
import { ApiRequestError } from '../lib/api';
import { Field, inputClass } from '../components/Field';
import { ErrorSummary, type FieldError } from '../components/ErrorSummary';

export function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'USER' as UserRole,
    preferredLanguage: (i18n.resolvedLanguage ?? 'en') as LanguageCode,
    district: '',
    state: '',
  });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: FieldError[] = [];
    if (form.name.trim().length < 2) found.push({ field: 'name', message: t('auth.err.name') });
    if (!form.email.trim() && !form.phone.trim())
      found.push({ field: 'phone', message: t('auth.err.contact') });
    if (form.password.length < 8) found.push({ field: 'password', message: t('auth.err.passwordShort') });
    if (found.length) {
      setErrors(found);
      return;
    }
    setErrors([]);
    setBusy(true);
    try {
      const payload: RegisterInput = {
        name: form.name.trim(),
        password: form.password,
        role: form.role,
        preferredLanguage: form.preferredLanguage,
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
        ...(form.district.trim() ? { district: form.district.trim() } : {}),
        ...(form.state.trim() ? { state: form.state.trim() } : {}),
      };
      await register(payload);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors([
        { message: err instanceof ApiRequestError ? err.message : t('auth.registerError') },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-wide max-w-form pb-20 pt-16 sm:pt-24">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{t("auth.registerTitle")}</h1>

      <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
        <ErrorSummary errors={errors} />

        <Field id="name" label={t('auth.name')}>
          <input
            id="name"
            className={inputClass}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            autoComplete="name"
          />
        </Field>

        <Field id="phone" label={t('auth.phone')}>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            className={inputClass}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
          />
        </Field>

        <Field id="email" label={t('auth.email')}>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
          />
        </Field>

        <Field id="password" label={t('auth.password')} hint={t('auth.passwordHint')}>
          <input
            id="password"
            type="password"
            className={inputClass}
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            autoComplete="new-password"
            aria-describedby="password-hint"
          />
        </Field>

        <Field id="role" label={t('auth.role')}>
          <select
            id="role"
            className={inputClass}
            value={form.role}
            onChange={(e) => set('role', e.target.value as UserRole)}
          >
            {SELF_ASSIGNABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`auth.role${r}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field id="preferredLanguage" label={t('auth.preferredLanguage')}>
          <select
            id="preferredLanguage"
            className={inputClass}
            value={form.preferredLanguage}
            onChange={(e) => set('preferredLanguage', e.target.value as LanguageCode)}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeLabel}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="district" label={t('auth.district')}>
            <input
              id="district"
              className={inputClass}
              value={form.district}
              onChange={(e) => set('district', e.target.value)}
            />
          </Field>
          <Field id="state" label={t('auth.state')}>
            <input
              id="state"
              className={inputClass}
              value={form.state}
              onChange={(e) => set('state', e.target.value)}
            />
          </Field>
        </div>

        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? t('common.loading') : t('auth.submitRegister')}
        </button>
      </form>

      <p className="mt-8">
        <Link to="/signin" className="font-bold">
          {t('auth.haveAccount')}
        </Link>
      </p>
    </div>
  );
}
