import Link from 'next/link';

export default function PostCard({ title, slug, date, excerpt, coverImage }) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <article className="post-card">
      {coverImage && (
        <Link href={`/blog/${slug}`} className="post-card-image-link">
          <img src={coverImage} alt={title} className="post-card-image" loading="lazy" />
        </Link>
      )}
      <div className="post-card-content">
        <time className="post-date" dateTime={date}>{formattedDate}</time>
        <h2 className="post-card-title">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
        {excerpt && <p className="post-card-excerpt">{excerpt}</p>}
        <Link href={`/blog/${slug}`} className="read-more">Read more →</Link>
      </div>
    </article>
  );
}
