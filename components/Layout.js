import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children, title = 'My Blog', description = 'A headless CMS blog' }) {
  const siteTitle = process.env.NEXT_PUBLIC_BLOG_TITLE || 'My Blog';

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="site-wrapper">
        <header className="site-header">
          <nav className="nav-container">
            <Link href="/" className="site-title">{siteTitle}</Link>
          </nav>
        </header>
        <main className="main-content">{children}</main>
        <footer className="site-footer">
          <p>&copy; {new Date().getFullYear()} {siteTitle}. Built with Next.js.</p>
        </footer>
      </div>
    </>
  );
}
