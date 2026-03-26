# Headless CMS & Blog

A custom, API-first content management system built with **Next.js** and **Express**. Write, format, and publish articles using a rich Markdown editor — with image uploads to AWS S3 and a clean public blog frontend.

---

## Features

- **Admin dashboard** — create, edit, publish, and delete posts from a dedicated `/admin` interface
- **Rich Markdown editor** — toolbar with bold, italic, headings, links, blockquotes, code blocks, and lists; Edit / Preview / Split view modes
- **Image uploads** — upload images directly in the editor; files are stored in AWS S3 and the URL is embedded automatically
- **File-based storage** — posts are stored as Markdown files with YAML front matter in `content/posts/`, making them easy to version-control or migrate
- **REST API** — full CRUD API under `/api/posts` and a file-upload endpoint at `/api/upload`
- **Public blog** — server-side rendered post listings and individual post pages at `/blog/:slug`
- **Draft / Published workflow** — posts default to draft and only appear on the public blog when marked as published
- **Incremental Static Regeneration** — the post list page revalidates every 60 seconds

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (Pages Router) |
| Server | [Express](https://expressjs.com/) (custom Next.js server) |
| Markdown parsing | [marked](https://marked.js.org/) + [DOMPurify](https://github.com/cure53/DOMPurify) |
| Front matter | [gray-matter](https://github.com/jonschlinkert/gray-matter) |
| Image storage | [AWS S3](https://aws.amazon.com/s3/) via `@aws-sdk/client-s3` |
| Unique IDs | [uuid](https://github.com/uuidjs/uuid) |

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- An **AWS account** with an S3 bucket (required only for image uploads; the rest of the CMS works without it)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yeffrydiaz/headless-cms.git
cd headless-cms
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key with S3 `PutObject` permission |
| `AWS_SECRET_ACCESS_KEY` | Corresponding AWS secret key |
| `AWS_REGION` | AWS region where your bucket lives (e.g. `us-east-1`) |
| `AWS_S3_BUCKET` | Name of the S3 bucket used for image uploads |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_BLOG_TITLE` | Display title shown on the blog homepage |

> **Note:** Image uploads will fail gracefully without AWS credentials. All other features remain fully functional.

### 4. Run in development

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

- **Public blog:** `http://localhost:3000`
- **Admin dashboard:** `http://localhost:3000/admin`

### 5. Build and run in production

```bash
npm run build
npm start
```

---

## Project Structure

```
headless-cms/
├── components/          # Shared React components
│   ├── AdminLayout.js   # Layout wrapper for admin pages
│   ├── Layout.js        # Layout wrapper for public pages
│   ├── MarkdownEditor.js# Rich Markdown editor with toolbar & split view
│   ├── MarkdownRenderer.js # Safe Markdown-to-HTML renderer
│   └── PostCard.js      # Post preview card for the blog listing
├── content/
│   └── posts/           # Markdown files (.md) — one file per post
├── lib/
│   ├── posts.js         # File-system helpers: CRUD for Markdown posts
│   └── s3.js            # AWS S3 upload helpers
├── pages/
│   ├── admin/
│   │   ├── index.js     # Admin dashboard (post list)
│   │   ├── editor.js    # New-post editor
│   │   └── editor/
│   │       └── [slug].js# Edit-existing-post editor
│   ├── api/
│   │   ├── posts/
│   │   │   ├── index.js # GET /api/posts, POST /api/posts
│   │   │   └── [slug].js# GET, PUT, DELETE /api/posts/:slug
│   │   └── upload.js    # POST /api/upload (image → S3)
│   ├── blog/
│   │   └── [slug].js    # Public post detail page
│   └── index.js         # Public blog homepage
├── styles/              # Global CSS
├── server.js            # Express + Next.js custom server
├── next.config.js       # Next.js configuration
└── .env.local.example   # Environment variable template
```

---

## API Reference

### Posts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts` | List all posts (including drafts) |
| `POST` | `/api/posts` | Create a new post |
| `GET` | `/api/posts/:slug` | Get a single post by slug |
| `PUT` | `/api/posts/:slug` | Update a post |
| `DELETE` | `/api/posts/:slug` | Delete a post |

**Post fields:**

```json
{
  "title": "My First Post",
  "slug": "my-first-post",
  "excerpt": "A short summary.",
  "coverImage": "https://example.com/image.jpg",
  "published": false,
  "content": "# Hello\n\nMarkdown content here."
}
```

### Upload

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload an image file; returns `{ "url": "https://..." }` |

Send the image as `multipart/form-data` with the field name `file`.

---

## Deployment

The app can be deployed anywhere that runs Node.js (e.g. a VPS, Railway, Render, or AWS EC2).

1. Set all environment variables on the hosting platform.
2. Run `npm run build` to create the production Next.js build.
3. Start with `npm start` (uses `NODE_ENV=production node server.js`).

For serverless platforms (Vercel, Netlify), remove `server.js` and let Next.js handle routing natively; the file-based post storage will need to be replaced with a database or external API.

---

## License

MIT

