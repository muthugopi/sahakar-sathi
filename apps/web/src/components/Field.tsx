import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

/**
 * GOV.UK-style form group: bold label, optional hint, and — when the field is
 * in error — a red message and a red left border on the whole group.
 */
export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className={error ? 'border-l-4 border-error ps-4' : undefined}>
      <label htmlFor={id} className="field-label text-lg">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 font-bold text-error">
          {error}
        </p>
      )}
      <div className="mt-2">{children}</div>
    </div>
  );
}

export const inputClass = 'field-shell aria-[invalid=true]:field-error';
