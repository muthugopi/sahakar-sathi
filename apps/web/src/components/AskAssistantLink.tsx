import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Deep-link into the assistant with a prefilled question. */
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
      <Link to={to} className="font-medium text-field-deep underline">
        {label ?? t('content.askAssistant')}
      </Link>
    );
  }

  return (
    <Link to={to} className="btn-outline">
      <span aria-hidden>💬</span> {label ?? t('content.askAssistant')}
    </Link>
  );
}
