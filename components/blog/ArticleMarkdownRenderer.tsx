import React from 'react';

interface ArticleMarkdownRendererProps {
  content: string;
}

export default function ArticleMarkdownRenderer({ content }: ArticleMarkdownRendererProps) {
  if (!content) return null;

  // Split into blocks by double newlines or single newlines depending on blocks
  const rawBlocks = content.split(/\n\s*\n/);

  const renderInline = (text: string): React.ReactNode => {
    // Process inline markdown: links, bold, italic, code
    // Regex for:
    // [link](url)
    // **bold**
    // *italic*
    // `code`
    const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Link
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (match) {
          const [, linkText, linkUrl] = match;
          const isExternal = linkUrl.startsWith('http');
          return (
            <a
              key={index}
              href={linkUrl}
              className="text-[#102C25] font-semibold underline decoration-[#B99A5A] underline-offset-4 hover:text-[#96783C] transition-colors"
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              {linkText}
            </a>
          );
        }
      }

      // Bold
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      // Italic
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }

      // Inline code
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      }

      return part;
    });
  };

  return (
    <div className="article-rich-body">
      {rawBlocks.map((block, blockIndex) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Code block
        if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
          const lines = trimmed.slice(3, -3).trim().split('\n');
          // First line might be language if not containing spaces
          const firstLine = lines[0] || '';
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const codeBody = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <pre key={blockIndex}>
              <code>{codeBody}</code>
            </pre>
          );
        }

        // Headings
        if (trimmed.startsWith('#### ')) {
          return <h4 key={blockIndex}>{renderInline(trimmed.replace(/^####\s+/, ''))}</h4>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={blockIndex}>{renderInline(trimmed.replace(/^###\s+/, ''))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={blockIndex}>{renderInline(trimmed.replace(/^##\s+/, ''))}</h2>;
        }
        if (trimmed.startsWith('# ')) {
          return <h2 key={blockIndex}>{renderInline(trimmed.replace(/^#\s+/, ''))}</h2>;
        }

        // Blockquotes
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed
            .split('\n')
            .map((line) => line.replace(/^>\s?/, ''))
            .join(' ');
          return (
            <blockquote key={blockIndex}>
              <p>{renderInline(quoteText)}</p>
            </blockquote>
          );
        }

        // Tables: lines start and end with '|'
        if (trimmed.includes('|') && trimmed.split('\n').every((l) => l.trim().startsWith('|'))) {
          const tableLines = trimmed.split('\n').map((l) => l.trim());
          if (tableLines.length >= 2) {
            const headerCells = tableLines[0]
              .slice(1, -1)
              .split('|')
              .map((c) => c.trim());
            // line 1 is usually |---|---|
            const bodyRows = tableLines
              .slice(2)
              .map((row) =>
                row
                  .slice(1, -1)
                  .split('|')
                  .map((c) => c.trim())
              );

            return (
              <table key={blockIndex}>
                <thead>
                  <tr>
                    {headerCells.map((h, i) => (
                      <th key={i}>{renderInline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rIndex) => (
                    <tr key={rIndex}>
                      {row.map((cell, cIndex) => (
                        <td key={cIndex}>{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }
        }

        // Unordered lists: lines start with '- ' or '* '
        if (trimmed.split('\n').every((line) => /^[-*]\s+/.test(line.trim()))) {
          const items = trimmed.split('\n').map((line) => line.trim().replace(/^[-*]\s+/, ''));
          return (
            <ul key={blockIndex}>
              {items.map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        // Ordered lists: lines start with '1. ', '2. ', etc.
        if (trimmed.split('\n').every((line) => /^\d+\.\s+/.test(line.trim()))) {
          const items = trimmed.split('\n').map((line) => line.trim().replace(/^\d+\.\s+/, ''));
          return (
            <ol key={blockIndex}>
              {items.map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }

        // Multi-line standard paragraph
        const lines = trimmed.split('\n');
        return (
          <p key={blockIndex}>
            {lines.map((line, lIndex) => (
              <React.Fragment key={lIndex}>
                {renderInline(line)}
                {lIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
