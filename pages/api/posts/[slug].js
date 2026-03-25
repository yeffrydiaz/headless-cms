import { getPostBySlug, updatePost, deletePost } from '../../../lib/posts';

export default function handler(req, res) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    const post = getPostBySlug(slug);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.status(200).json(post);
  }

  if (req.method === 'PUT') {
    const data = req.body;
    const post = updatePost(slug, data);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.status(200).json(post);
  }

  if (req.method === 'DELETE') {
    const deleted = deletePost(slug);
    if (!deleted) return res.status(404).json({ error: 'Post not found' });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
