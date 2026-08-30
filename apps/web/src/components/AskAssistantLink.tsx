import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function AskAssistantLink({
  question,
  label,
  variant = 'outline',
}: {
  question: string;
  label?: string;
  variant?: 'outline' | 'plain';
}) {
  const { t } = useTranslation();
  const to = `/assistant?q=${encodeURIComponent(question)}`;

  if (variant === 'plain') {
    return (
      <Link to={to} className="inline-flex items-center gap-2 font-semibold text-field-deep hover:text-field">
        {label ?? t('content.askAssistant')}
        <span aria-hidden>→</span>
      </Link>
    );
  }

  return (
    <Link to={to} className="btn-primary">
      <span aria-hidden>💬</span>
      {label ?? t('content.askAssistant')}
    </Link>
  );
}
