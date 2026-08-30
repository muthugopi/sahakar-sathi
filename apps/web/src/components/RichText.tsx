import { Fragment, type ReactNode } from 'react';

/**
 * Tiny, dependency-free renderer for the light Markdown the assistant produces:
 * paragraphs, bullet / numbered lists, **bold**, _italic_, and [1] citation
 * markers. Builds React nodes (no dangerouslySetInnerHTML) so it is XSS-safe.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|_[^_]+_|\[\d+(?:\s*,\s*\d+)*\])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${i++}`;
    if (tok.startsWith('**')) nodes.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('_')) nodes.push(<em key={key}>{tok.slice(1, -1)}</em>);
    else
      nodes.push(
        <sup key={key} className="text-primary font-semibold">
          {tok}
        </sup>,
      );
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, '\n').split(/\n{2,}/);

  return (
    <div className="space-y-3 leading-relaxed">
      {blocks.map((block, bi) => {
        const lines = block.split('\n');
        const isBulleted = lines.every((l) => /^\s*[-*]\s+/.test(l));
        const isNumbered = lines.every((l) => /^\s*\d+[.)]\s+/.test(l));

        if (isBulleted || isNumbered) {
          const ListTag = isNumbered ? 'ol' : 'ul';
          return (
            <ListTag
              key={bi}
              className={isNumbered ? 'list-decimal space-y-1 ps-5' : 'list-disc space-y-1 ps-5'}
            >
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*(?:[-*]|\d+[.)])\s+/, ''), `${bi}-${li}`)}</li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
