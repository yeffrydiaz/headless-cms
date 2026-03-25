import { getAllPosts, getPublishedPosts, createPost } from '../../../lib/posts';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { published } = req.query;
    const posts = published === 'true' ? getPublishedPosts() : getAllPosts();
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const data = req.body;
    if (!data.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const post = createPost(data);
    return res.status(201).json(post);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
