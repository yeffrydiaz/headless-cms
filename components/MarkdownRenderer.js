import { useEffect, useState } from 'react';

export default function MarkdownRenderer({ content }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    async function render() {
      const { marked } = await import('marked');
      const { default: DOMPurify } = await import('dompurify');
      const rawHtml = marked.parse(content || '');
      const clean = DOMPurify.sanitize(rawHtml);
      setHtml(clean);
    }
    render();
  }, [content]);

  return (
    <article
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
