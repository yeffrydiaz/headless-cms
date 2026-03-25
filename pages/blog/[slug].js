import Layout from '../../components/Layout';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { getPublishedPosts, getPostBySlug } from '../../lib/posts';

export default function BlogPost({ post }) {
  if (!post) return null;

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
    url: postUrl,
    image: post.coverImage || undefined,
  };

  return (
    <Layout title={`${post.title} | Blog`} description={post.excerpt}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="blog-post">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="post-cover"
          />
        )}
        <header className="post-header">
          <time className="post-date" dateTime={post.date}>{formattedDate}</time>
          <h1 className="post-title">{post.title}</h1>
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        </header>
        <MarkdownRenderer content={post.content} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const posts = getPublishedPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post || !post.published) {
    return { notFound: true };
  }
  return {
    props: { post },
    revalidate: 60,
  };
}
