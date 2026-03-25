import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(slug) {
    if (!confirm(`Delete post "${slug}"?`)) return;
    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } else {
      alert('Failed to delete post');
    }
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>All Posts</h1>
          <Link href="/admin/editor" className="btn btn-primary">+ New Post</Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet. <Link href="/admin/editor">Create your first post.</Link></p>
        ) : (
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.slug}>
                  <td>{post.title}</td>
                  <td><code>{post.slug}</code></td>
                  <td>{post.date}</td>
                  <td>
                    <span className={`badge ${post.published ? 'badge-published' : 'badge-draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="actions">
                    <Link href={`/admin/editor/${post.slug}`} className="btn btn-small">Edit</Link>
                    {post.published && (
                      <Link href={`/blog/${post.slug}`} target="_blank" className="btn btn-small btn-secondary">View</Link>
                    )}
                    <button onClick={() => handleDelete(post.slug)} className="btn btn-small btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
