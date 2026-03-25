const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

function ensureDirectoryExists() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

function getAllPosts() {
  ensureDirectoryExists();
  const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
  return fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return { ...data, slug };
  });
}

function getPublishedPosts() {
  return getAllPosts()
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getPostBySlug(slug) {
  ensureDirectoryExists();
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return { ...data, slug, content };
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function createPost(data) {
  ensureDirectoryExists();
  const slug = data.slug || slugify(data.title);
  const date = data.date || new Date().toISOString().split('T')[0];
  const frontmatter = {
    title: data.title || '',
    slug,
    date,
    excerpt: data.excerpt || '',
    coverImage: data.coverImage || '',
    published: data.published !== undefined ? data.published : false,
  };
  const fileContent = matter.stringify(data.content || '', frontmatter);
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  fs.writeFileSync(fullPath, fileContent, 'utf8');
  return { ...frontmatter, content: data.content || '' };
}

function updatePost(slug, data) {
  ensureDirectoryExists();
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const existing = getPostBySlug(slug);
  const updated = { ...existing, ...data, slug: data.slug || slug };
  const frontmatter = {
    title: updated.title,
    slug: updated.slug,
    date: updated.date,
    excerpt: updated.excerpt || '',
    coverImage: updated.coverImage || '',
    published: updated.published !== undefined ? updated.published : false,
  };
  const fileContent = matter.stringify(updated.content || '', frontmatter);
  // If slug changed, rename file
  if (data.slug && data.slug !== slug) {
    const newPath = path.join(postsDirectory, `${data.slug}.md`);
    fs.writeFileSync(newPath, fileContent, 'utf8');
    fs.unlinkSync(fullPath);
  } else {
    fs.writeFileSync(fullPath, fileContent, 'utf8');
  }
  return { ...frontmatter, content: updated.content || '' };
}

function deletePost(slug) {
  ensureDirectoryExists();
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return false;
  fs.unlinkSync(fullPath);
  return true;
}

module.exports = { getAllPosts, getPublishedPosts, getPostBySlug, createPost, updatePost, deletePost, slugify };
