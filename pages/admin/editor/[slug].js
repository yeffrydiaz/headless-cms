import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import MarkdownEditor from '../../../components/MarkdownEditor';
import { getPostBySlug } from '../../../lib/posts';

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function EditPostEditor({ post: initialPost }) {
  const router = useRouter();
  const [form, setForm] = useState(initialPost);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const originalSlug = initialPost.slug;

  function handleChange(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/posts/${originalSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update post');
      }
      const updated = await res.json();
      setSuccess('Post updated!');
      if (updated.slug !== originalSlug) {
        router.replace(`/admin/editor/${updated.slug}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title={`Edit: ${form.title}`}>
      <div className="editor-page">
        <h1>Edit Post</h1>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              value={form.excerpt || ''}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              id="coverImage"
              type="url"
              value={form.coverImage || ''}
              onChange={(e) => handleChange('coverImage', e.target.value)}
            />
          </div>
          <div className="form-group form-group-checkbox">
            <label>
              <input
                type="checkbox"
                checked={form.published || false}
                onChange={(e) => handleChange('published', e.target.checked)}
              />
              Published
            </label>
          </div>
          <div className="form-group">
            <label>Content</label>
            <MarkdownEditor value={form.content || ''} onChange={(v) => handleChange('content', v)} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { notFound: true };
  }
  return { props: { post } };
}
