import { useRef, useEffect, useState } from 'react';
import '../styles/editor.css';

export default function MarkdownEditor({ value, onChange }) {
  const textareaRef = useRef(null);
  const [preview, setPreview] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function updatePreview() {
      if (!value) { setPreview(''); return; }
      const { marked } = await import('marked');
      const { default: DOMPurify } = await import('dompurify');
      const raw = marked.parse(value);
      setPreview(DOMPurify.sanitize(raw));
    }
    updatePreview();
  }, [value]);

  function getTextarea() {
    return textareaRef.current;
  }

  function wrapSelection(before, after = before) {
    const ta = getTextarea();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }

  function insertAtLineStart(prefix) {
    const ta = getTextarea();
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  }

  function insertLink() {
    const ta = getTextarea();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end) || 'link text';
    const url = prompt('Enter URL:') || '#';
    const insertion = `[${selected}](${url})`;
    const newValue = value.substring(0, start) + insertion + value.substring(end);
    onChange(newValue);
    setTimeout(() => ta.focus(), 0);
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        const ta = getTextarea();
        const pos = ta.selectionStart;
        const insertion = `![${file.name}](${data.url})`;
        const newValue = value.substring(0, pos) + insertion + value.substring(pos);
        onChange(newValue);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    }
    e.target.value = '';
  }

  const toolbarItems = [
    { label: 'B', title: 'Bold', action: () => wrapSelection('**') },
    { label: 'I', title: 'Italic', action: () => wrapSelection('_') },
    { label: 'H1', title: 'Heading 1', action: () => insertAtLineStart('# ') },
    { label: 'H2', title: 'Heading 2', action: () => insertAtLineStart('## ') },
    { label: 'H3', title: 'Heading 3', action: () => insertAtLineStart('### ') },
    { label: '🔗', title: 'Link', action: insertLink },
    { label: '"', title: 'Blockquote', action: () => insertAtLineStart('> ') },
    { label: '<>', title: 'Code Block', action: () => wrapSelection('```\n', '\n```') },
    { label: '•', title: 'Unordered List', action: () => insertAtLineStart('- ') },
    { label: '1.', title: 'Ordered List', action: () => insertAtLineStart('1. ') },
  ];

  return (
    <div className="markdown-editor">
      <div className="editor-toolbar">
        {toolbarItems.map((item) => (
          <button
            key={item.title}
            type="button"
            title={item.title}
            className="toolbar-btn"
            onMouseDown={(e) => { e.preventDefault(); item.action(); }}
          >
            {item.label}
          </button>
        ))}
        <span className="toolbar-separator" />
        <button
          type="button"
          title="Upload Image"
          className="toolbar-btn"
          onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
        >
          🖼️
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <div className="editor-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Edit
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'split' ? 'active' : ''}`}
            onClick={() => setActiveTab('split')}
          >
            Split
          </button>
        </div>
      </div>
      <div className={`editor-panes ${activeTab}`}>
        {(activeTab === 'editor' || activeTab === 'split') && (
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your markdown here..."
            spellCheck={false}
          />
        )}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div
            className="editor-preview prose"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        )}
      </div>
    </div>
  );
}
