import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { getPublishedPosts } from '../lib/posts';

export default function Home({ posts }) {
  return (
    <Layout
      title={process.env.NEXT_PUBLIC_BLOG_TITLE || 'My Blog'}
      description="A headless CMS-powered blog"
    >
      <div className="home-container">
        <section className="hero">
          <h1>{process.env.NEXT_PUBLIC_BLOG_TITLE || 'My Blog'}</h1>
          <p className="hero-sub">Thoughts, ideas, and articles</p>
        </section>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet. Check back soon!</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getPublishedPosts();
  return {
    props: { posts },
    revalidate: 60,
  };
}
