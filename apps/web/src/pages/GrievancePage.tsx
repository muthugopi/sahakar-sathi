import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GRIEVANCE_CATEGORIES } from '@sahakar/shared';
import type {
  CreateGrievanceInput,
  GrievanceAttachment,
  GrievanceCategory,
  LanguageCode,
} from '@sahakar/shared';
import { ApiRequestError } from '../lib/api';
import { submitGrievance, uploadAttachment } from '../lib/grievance';
import { useAuth } from '../lib/auth';
import { Field, inputClass } from '../components/Field';
import { DictationTextarea } from '../components/DictationTextarea';
import { ErrorSummary, type FieldError } from '../components/ErrorSummary';
import { Breadcrumbs } from '../components/Breadcrumbs';

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

  const [errors, setErrors] = useState<FieldError[]>([]);
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
    const found: FieldError[] = [];
    if (!category) found.push({ field: 'category-group', message: t('grievance.chooseCategory') });
    if (description.trim().length < 20)
      found.push({ field: 'description', message: t('grievance.err.description') });
    if (found.length) {
      setErrors(found);
      return;
    }
    setErrors([]);
    setBusy(true);
    try {
      const payload: CreateGrievanceInput = {
        category: category as GrievanceCategory,
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
      setErrors([
        { message: err instanceof ApiRequestError ? err.message : t('grievance.submitFailed') },
      ]);
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div className="container-page max-w-prose">
        <div className="notice border-primary/25 bg-primary-tint/40 text-center">
          <p className="eyebrow text-primary">{t('grievance.submittedTitle')}</p>
          <p className="mt-3 font-display text-4xl font-semibold tracking-wide text-ink">
            {result.trackingId}
          </p>
          <p className="mt-4">
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
          </p>
        </div>

        <p className="mt-6 text-ink-2">{t('grievance.saveIdNote')}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={`/track/${result.trackingId}`} className="btn-primary btn-block">
            {t('grievance.trackNow')}
          </Link>
          <Link to="/" className="btn-secondary btn-block">
            {t('common.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-prose">
      <Breadcrumbs trail={[{ label: t('grievance.title') }]} />

      <h1 className="text-3xl sm:text-4xl">{t('grievance.title')}</h1>
      <p className="mt-4 text-lg text-ink-2">{t('grievance.intro')}</p>
      <p className="mt-3">
        <Link to="/track" className="font-bold">
          {t('grievance.alreadyHaveId')}
        </Link>
      </p>

      <form className="mt-8 space-y-8" onSubmit={onSubmit} noValidate>
        <ErrorSummary errors={errors} />

        <fieldset id="category-group">
          <legend className="field-label text-lg">{t('grievance.categoryLabel')}</legend>
          <div className="mt-3 space-y-2">
            {GRIEVANCE_CATEGORIES.map((c) => (
              <label key={c} className="flex items-start gap-3">
                <input
                  type="radio"
                  name="category"
                  value={c}
                  checked={category === c}
                  onChange={() => setCategory(c)}
                  className="mt-1 h-5 w-5"
                />
                <span>{t(`grievance.category.${c}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          id="description"
          label={t('grievance.descriptionLabel')}
          hint={t('grievance.descriptionHint')}
        >
          <DictationTextarea
            id="description"
            value={description}
            onChange={setDescription}
            language={language}
            rows={6}
            maxLength={5000}
            placeholder={t('grievance.descriptionPlaceholder')}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="district" label={t('auth.district')}>
            <input
              id="district"
              className={inputClass}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </Field>
          <Field id="state" label={t('auth.state')}>
            <input
              id="state"
              className={inputClass}
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
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
          <p className="field-label text-lg">{t('grievance.attachmentsLabel')}</p>
          <p className="field-hint">{t('grievance.attachmentsHint', { max: MAX_FILES, mb: MAX_MB })}</p>

          {attachments.length > 0 && (
            <ul className="mt-3 border-t border-line">
              {attachments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 border-b border-line py-2"
                >
                  <span className="truncate">{a.originalName}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments((list) => list.filter((x) => x.id !== a.id))}
                    className="shrink-0 font-bold text-error underline"
                  >
                    {t('grievance.removeFile')}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {attachments.length < MAX_FILES && (
            <label className="btn-secondary mt-3 cursor-pointer">
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
          {uploadError && <p className="mt-2 font-bold text-error">{uploadError}</p>}
        </div>

        <div>
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? t('common.loading') : t('grievance.submit')}
          </button>
          <p className="field-hint mt-3">{t('grievance.privacyNote')}</p>
        </div>
      </form>
    </div>
  );
}
