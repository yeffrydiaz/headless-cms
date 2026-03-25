import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import MarkdownEditor from '../../components/MarkdownEditor';

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function NewPostEditor() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    published: false,
    content: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(field, val) {
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'title' && !prev.slug) {
        next.slug = slugify(val);
      }
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to create post');
      }
      const post = await res.json();
      router.push(`/admin/editor/${post.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="New Post">
      <div className="editor-page">
        <h1>New Post</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              placeholder="Post title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="post-slug"
            />
          </div>
          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              rows={3}
              placeholder="Short description..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              id="coverImage"
              type="url"
              value={form.coverImage}
              onChange={(e) => handleChange('coverImage', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="form-group form-group-checkbox">
            <label>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => handleChange('published', e.target.checked)}
              />
              Published
            </label>
          </div>
          <div className="form-group">
            <label>Content</label>
            <MarkdownEditor value={form.content} onChange={(v) => handleChange('content', v)} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
