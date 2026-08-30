import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GRIEVANCE_CATEGORIES } from '@sahakar/shared';
import type { CreateGrievanceInput, GrievanceAttachment, GrievanceCategory, LanguageCode } from '@sahakar/shared';
import { ApiRequestError } from '../lib/api';
import { submitGrievance, uploadAttachment } from '../lib/grievance';
import { useAuth } from '../lib/auth';
import { Field, inputClass } from '../components/Field';
import { DictationTextarea } from '../components/DictationTextarea';

const MAX_FILES = 5;
const MAX_MB = 10;

export function GrievancePage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const language = (i18n.resolvedLanguage ?? 'en') as LanguageCode;

  const [category, setCategory] = useState<GrievanceCategory | ''>('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState(user?.district ?? '');
  const [stateName, setStateName] = useState(user?.state ?? '');
  const [contactPhone, setContactPhone] = useState(user?.phone ?? '');
  const [attachments, setAttachments] = useState<GrievanceAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ trackingId: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadError(t('grievance.fileTooLarge', { mb: MAX_MB }));
      return;
    }
    if (attachments.length >= MAX_FILES) {
      setUploadError(t('grievance.tooManyFiles', { max: MAX_FILES }));
      return;
    }
    setUploading(true);
    try {
      const attachment = await uploadAttachment(file);
      setAttachments((a) => [...a, attachment]);
    } catch (err) {
      setUploadError(err instanceof ApiRequestError ? err.message : t('grievance.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!category) {
      setError(t('grievance.chooseCategory'));
      return;
    }
    setBusy(true);
    try {
      const payload: CreateGrievanceInput = {
        category,
        description: description.trim(),
        language,
        ...(district.trim() ? { district: district.trim() } : {}),
        ...(stateName.trim() ? { state: stateName.trim() } : {}),
        ...(contactPhone.trim() ? { contactPhone: contactPhone.trim() } : {}),
        ...(attachments.length ? { attachmentIds: attachments.map((a) => a.id) } : {}),
      };
      const res = await submitGrievance(payload);
      setResult({ trackingId: res.trackingId });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : t('grievance.submitFailed'));
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div className="container-page max-w-xl py-12">
        <div className="section-shell overflow-hidden p-0">
          <div className="border-b border-line bg-field-soft px-6 py-5 text-center">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-field-deep">
              {t('grievance.submittedTitle')}
            </p>
            <p className="mt-3 font-mono text-3xl font-bold tracking-[0.2em] text-ink">
              {result.trackingId}
            </p>
          </div>

          <div className="p-6 text-center">
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(result.trackingId);
                setCopied(true);
              }}
              className="btn-secondary"
            >
              {copied ? t('grievance.copied') : t('grievance.copyId')}
            </button>

            <p className="mt-5 border-s-4 border-marigold ps-3 text-left text-sm text-muted">
              {t('grievance.saveIdNote')}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to={`/track/${result.trackingId}`} className="btn-primary">
                {t('grievance.trackNow')}
              </Link>
              <Link to="/" className="btn-secondary">
                {t('common.backHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-8 sm:py-10">
      <div className="section-shell p-6 sm:p-7">
        <h1 className="text-3xl tracking-[-0.05em] text-field-deep sm:text-4xl">{t('grievance.title')}</h1>
        <p className="mt-3 text-base text-muted">{t('grievance.intro')}</p>
        <p className="mt-3 text-sm">
          <Link to="/track" className="font-medium text-field-deep underline">
            {t('grievance.alreadyHaveId')}
          </Link>
        </p>

        <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
          {error && (
            <p role="alert" className="rounded-2xl border border-clay/40 bg-clay/5 px-3 py-2 text-sm font-medium text-clay">
              {error}
            </p>
          )}

          <fieldset>
            <legend className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">{t('grievance.categoryLabel')}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {GRIEVANCE_CATEGORIES.map((c) => (
                <label
                  key={c}
                  className={`flex cursor-pointer items-start gap-2 rounded-2xl border p-3 text-sm transition-colors ${
                    category === c ? 'border-field bg-field-soft' : 'border-line bg-soft'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={c}
                    checked={category === c}
                    onChange={() => setCategory(c)}
                    className="mt-0.5"
                  />
                  <span>{t(`grievance.category.${c}`)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Field id="description" label={t('grievance.descriptionLabel')} hint={t('grievance.descriptionHint')}>
            <DictationTextarea
              id="description"
              value={description}
              onChange={setDescription}
              language={language}
              rows={6}
              required
              maxLength={5000}
              placeholder={t('grievance.descriptionPlaceholder')}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="district" label={t('auth.district')}>
              <input id="district" className={inputClass} value={district} onChange={(e) => setDistrict(e.target.value)} />
            </Field>
            <Field id="state" label={t('auth.state')}>
              <input id="state" className={inputClass} value={stateName} onChange={(e) => setStateName(e.target.value)} />
            </Field>
          </div>

          <Field id="phone" label={t('grievance.contactLabel')} hint={t('grievance.contactHint')}>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              className={inputClass}
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </Field>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">{t('grievance.attachmentsLabel')}</p>
            <p className="mt-1 text-sm text-muted">{t('grievance.attachmentsHint', { max: MAX_FILES, mb: MAX_MB })}</p>
            <ul className="mt-3 space-y-2">
              {attachments.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-2xl border border-line bg-soft px-3 py-2 text-sm">
                  <span className="truncate">{a.originalName}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments((list) => list.filter((x) => x.id !== a.id))}
                    className="ms-3 shrink-0 font-medium text-clay"
                  >
                    {t('grievance.removeFile')}
                  </button>
                </li>
              ))}
            </ul>
            {attachments.length < MAX_FILES && (
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-2 text-sm font-semibold text-ink hover:bg-field-soft">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={onPickFile}
                  className="sr-only"
                  disabled={uploading}
                />
                {uploading ? t('common.loading') : t('grievance.addFile')}
              </label>
            )}
            {uploadError && <p className="mt-2 text-sm text-clay">{uploadError}</p>}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={busy}>
              {busy ? t('common.loading') : t('grievance.submit')}
            </button>
            <p className="text-sm text-muted">{t('grievance.privacyNote')}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
