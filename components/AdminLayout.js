import Link from 'next/link';
import Head from 'next/head';

export default function AdminLayout({ children, title = 'Admin' }) {
  return (
    <>
      <Head>
        <title>{title} — CMS Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="admin-wrapper">
        <header className="admin-header">
          <nav className="admin-nav">
            <Link href="/admin" className="admin-logo">CMS Admin</Link>
            <div className="admin-nav-links">
              <Link href="/admin">Dashboard</Link>
              <Link href="/admin/editor">New Post</Link>
              <Link href="/" target="_blank">View Blog</Link>
            </div>
          </nav>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}
