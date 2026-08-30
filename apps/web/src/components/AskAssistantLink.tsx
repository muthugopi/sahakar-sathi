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
  const text = label ?? t('content.askAssistant');

  if (variant === 'plain') {
    return (
      <Link to={to} className="font-bold">
        {text}
      </Link>
    );
  }

  return (
    <Link to={to} className="btn-secondary">
      {text}
    </Link>
  );
}
