import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

/** Labelled form control with hint + error text wired for screen readers. */
export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-clay">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  'min-h-[3rem] rounded border border-line bg-panel px-3 py-2 text-base ' +
  'focus-visible:outline-field aria-[invalid=true]:border-clay';
