# Product Company Interview Bank — Next.js (50 Questions)

> **Target companies:** Google, Meta, Microsoft, Amazon, Adobe, Atlassian, Uber, Flipkart
> **Rule:** Full terms only — spell out JWT as JSON Web Token, API as Application Programming Interface, etc.

---

### Question 1: What is Next.js and why use it over plain React?

**Answer:** Next.js is a React framework created by Vercel that adds production features on top of React: file-based routing, server-side rendering, static site generation, built-in Application Programming Interface (API) routes, image optimization, and more. Companies use it because it solves common web app problems (Search Engine Optimization, performance, deployment) without building everything from scratch. It powers sites at Netflix, TikTok, and many startups.

---

### Question 2: What is the difference between the Pages Router and App Router?

**Answer:** The Pages Router (Next.js 12 and earlier) uses a `pages/` directory — each file becomes a route, and data fetching uses `getServerSideProps`, `getStaticProps`, or `getInitialProps`. The App Router (Next.js 13+) uses an `app/` directory with nested layouts, React Server Components by default, and simpler data fetching with async server components. New projects should use the App Router; Pages Router is still supported for existing apps.

---

### Question 3: What is Server-Side Rendering (SSR)?

**Answer:** Server-Side Rendering means the server generates HTML for each request by running React on the server, then sends complete HTML to the browser. The page shows content quickly and is crawlable by search engines. In the App Router, a page is SSR when it is dynamic (not statically cached) — for example, using `cookies()`, `headers()`, or `export const dynamic = 'force-dynamic'`. After HTML arrives, React hydrates the page for interactivity.

---

### Question 4: What is Static Site Generation (SSG)?

**Answer:** Static Site Generation pre-builds HTML at build time for pages that do not change per user. The HTML is served from a Content Delivery Network (CDN), making responses very fast and cheap. In the App Router, pages are static by default unless they use dynamic functions or opt out. Use SSG for marketing pages, blogs, and documentation where content is the same for everyone.

---

### Question 5: What is Incremental Static Regeneration (ISR)?

**Answer:** Incremental Static Regeneration lets you update static pages after build without rebuilding the entire site. You set a revalidation time (e.g., 60 seconds). The first request after that window triggers a background rebuild; subsequent requests get the fresh page. In the App Router, use `export const revalidate = 60` or `next: { revalidate: 60 }` in fetch options. Ideal for product catalogs or news that changes occasionally.

---

### Question 6: What are React Server Components in Next.js?

**Answer:** React Server Components (RSC) run only on the server. They can fetch data, read files, and query databases directly without exposing credentials to the browser. They do not ship JavaScript to the client for their own logic. In the App Router, components in `app/` are Server Components by default. They cannot use `useState`, `useEffect`, or browser APIs. Add `'use client'` at the top to make a Client Component.

---

### Question 7: What are Client Components in Next.js?

**Answer:** Client Components run in the browser and support interactivity — clicks, forms, hooks, and browser APIs. Mark them with `'use client'` at the top of the file. Use Client Components for: event handlers, `useState`/`useEffect`, custom hooks, and third-party libraries that use browser APIs. Keep Client Components as small as possible ("leaf" pattern) — wrap interactive parts, not entire pages.

---

### Question 8: How does file-based routing work in the App Router?

**Answer:** Folders define route segments; `page.tsx` makes a route publicly accessible; `layout.tsx` wraps shared user interface; `loading.tsx` shows while content loads; `error.tsx` handles errors; `not-found.tsx` handles 404s. Example: `app/blog/[slug]/page.tsx` maps to `/blog/my-post`. Route groups `(marketing)` organize files without affecting the URL. Parallel routes `@modal` and intercepting routes enable advanced patterns like modals over pages.

---

### Question 9: What are layouts in Next.js?

**Answer:** Layouts wrap child pages and persist across navigation without re-rendering — ideal for navbars, sidebars, and footers. In `app/dashboard/layout.tsx`, the layout wraps all routes under `/dashboard`. Layouts can nest: root layout → dashboard layout → page. Unlike Pages Router `_app.js`, App Router layouts do not remount when navigating between sibling routes, preserving state in the layout.

---

### Question 10: What is the root layout?

**Answer:** `app/layout.tsx` is the root layout required in every App Router project. It must include `<html>` and `<body>` tags. It wraps all pages and is the place for global styles, fonts, metadata defaults, and providers. Only one root layout exists. Changes here affect the entire application.

---

### Question 11: How do you fetch data in Server Components?

**Answer:** Call `fetch` or database clients directly inside async Server Components — no `useEffect` needed. Example: `async function Page() { const res = await fetch('https://api.example.com/posts'); const posts = await res.json(); return <ul>...</ul> }`. Next.js extends `fetch` with caching options: `{ cache: 'force-cache' }` for static, `{ cache: 'no-store' }` for dynamic, `{ next: { revalidate: 3600 } }` for Incremental Static Regeneration.

---

### Question 12: What is the difference between `cache: 'no-store'` and `revalidate`?

**Answer:** `cache: 'no-store'` fetches fresh data on every request — fully dynamic, like Server-Side Rendering on each visit. `next: { revalidate: N }` caches the result for N seconds, then regenerates in the background (Incremental Static Regeneration). Choose `no-store` for personalized or real-time data (user dashboard). Choose `revalidate` for semi-static content (product list updated hourly).

---

### Question 13: What is Next.js Middleware?

**Answer:** Middleware runs before a request completes — at the edge, close to the user. Define it in `middleware.ts` at the project root. Use cases: authentication redirects, geolocation-based routing, A/B testing, rewriting URLs, and setting headers. It runs on the Edge Runtime (limited Node.js APIs). Example: redirect unauthenticated users from `/dashboard` to `/login`.

---

### Question 14: How do you handle authentication in Next.js?

**Answer:** Common approaches: (1) Middleware checks session or JSON Web Token (JWT) cookie and redirects. (2) Server Components read session from cookies via `cookies()` and conditionally render. (3) Libraries like NextAuth.js (Auth.js) handle OAuth, sessions, and callbacks. (4) Client-side auth for Single Page Application-style flows with protected Client Components. Prefer server-side session checks for security-sensitive routes.

---

### Question 15: What are API Routes in Next.js?

**Answer:** API Routes let you build backend endpoints inside your Next.js app. In the App Router, create `app/api/users/route.ts` with exported `GET`, `POST`, `PUT`, `DELETE` functions. In the Pages Router, use `pages/api/users.ts`. They run on the server and are useful for form handling, webhooks, and Backend-for-Frontend patterns without a separate Express server.

---

### Question 16: What is the Backend-for-Frontend (BFF) pattern in Next.js?

**Answer:** Backend-for-Frontend means your Next.js API routes act as a thin layer between the frontend and external services. They hide API keys, aggregate multiple backend calls into one response, and shape data for the user interface. Example: `/api/dashboard` fetches user, orders, and notifications server-side and returns one JSON object — faster and more secure than exposing multiple keys to the browser.

---

### Question 17: What is `next/image` and why use it?

**Answer:** `next/image` is Next.js's optimized Image component. It automatically serves correctly sized images, lazy-loads below-the-fold images, supports modern formats like WebP, and prevents layout shift with width/height. It can optimize remote images when you configure `remotePatterns` in `next.config.js`. Using it improves Largest Contentful Paint (LCP) — a Core Web Vital that affects Search Engine Optimization and user experience.

---

### Question 18: What is `next/font`?

**Answer:** `next/font` loads Google Fonts or local fonts at build time and self-hosts them — no external requests to Google at runtime. It eliminates layout shift by computing font metrics and applies `font-display: swap` automatically. Example: `import { Inter } from 'next/font/google'` then apply `inter.className` to your layout. Improves performance and privacy.

---

### Question 19: What is `next/link`?

**Answer:** `next/link` is the Next.js navigation component for client-side transitions between pages without full page reloads. It prefetches linked pages in the viewport by default (in production), making navigation feel instant. Use `<Link href="/about">About</Link>` instead of `<a>` for internal routes. For external links, use regular `<a>` with `target="_blank"` and `rel="noopener noreferrer"`.

---

### Question 20: What is prefetching in Next.js?

**Answer:** Prefetching loads page data and JavaScript in the background before the user clicks a link. `<Link>` prefetches routes in the viewport automatically. You can disable with `prefetch={false}`. In the App Router, static routes prefetch fully; dynamic routes prefetch partially until visited. Prefetching makes Single Page Application-style navigation feel instant while keeping Search Engine Optimization benefits.

---

### Question 21: What are loading and streaming in the App Router?

**Answer:** `loading.tsx` automatically wraps a page in a Suspense boundary — show a skeleton while the page loads. React streams HTML to the browser as Server Components resolve, so users see the shell immediately and content fills in progressively. Nested `loading.tsx` files give granular loading states per route segment. This improves perceived performance on slow data fetches.

---

### Question 22: What is `Suspense` in Next.js?

**Answer:** Suspense lets you defer rendering part of the page until data is ready, showing a fallback meanwhile. In the App Router, wrap slow Server Components or use `loading.tsx` for automatic Suspense. You can also wrap Client Components that lazy-load. Streaming sends the fallback HTML first, then replaces it when ready — users see progress instead of a blank screen.

---

### Question 23: What is `error.tsx` in Next.js?

**Answer:** `error.tsx` is an error boundary for a route segment. When an error is thrown during rendering or data fetching, Next.js shows this component instead of crashing the whole app. It must be a Client Component (`'use client'`) because error boundaries require client-side React. It receives `error` and `reset` props — `reset()` tries re-rendering the segment. Place at appropriate levels for graceful degradation.

---

### Question 24: What is `not-found.tsx`?

**Answer:** `not-found.tsx` renders when you call the `notFound()` function from `next/navigation` — for example, when a blog post slug does not exist in the database. It returns a 404 status. Each route segment can have its own `not-found.tsx`. The root `app/not-found.tsx` handles global 404s for unmatched routes.

---

### Question 25: What are dynamic route segments?

**Answer:** Dynamic segments use square brackets in folder names: `[id]`, `[slug]`, or catch-all `[...slug]`. Access params in Server Components via `async function Page({ params }: { params: { id: string } })`. Optional catch-all `[[...slug]]` matches zero or more segments. Use for user profiles (`/users/[id]`), blog posts (`/blog/[slug]`), and documentation paths.

---

### Question 26: What are Route Handlers vs Server Actions?

**Answer:** Route Handlers (`app/api/.../route.ts`) are REST-style endpoints — good for webhooks, third-party integrations, and clients that expect HTTP APIs. Server Actions are async functions marked with `'use server'` called directly from forms and components — good for mutations like creating a post or updating a profile. Server Actions reduce boilerplate; Route Handlers offer full HTTP control (status codes, headers).

---

### Question 27: What are Server Actions?

**Answer:** Server Actions are functions that run on the server, invoked from Client or Server Components — typically via forms. Mark a file or function with `'use server'`. Example: `<form action={createPost}>`. They integrate with React 19 Actions for pending states. Benefits: no separate API route, automatic POST requests, progressive enhancement (forms work without JavaScript), and secrets stay on the server.

---

### Question 28: What is `useRouter` from `next/navigation`?

**Answer:** In the App Router, `useRouter` from `next/navigation` (not `next/router`) provides programmatic navigation: `router.push('/dashboard')`, `router.replace('/login')`, `router.back()`, and `router.refresh()` to re-fetch server data. It is a Client Component hook. Use it after form success, logout, or conditional redirects based on client state.

---

### Question 29: What is the difference between `router.push` and `router.replace`?

**Answer:** `router.push('/path')` navigates to a new URL and adds an entry to the browser history — the back button returns to the previous page. `router.replace('/path')` navigates without adding history — useful after login (user should not "back" into the login page) or redirect chains. Both trigger client-side navigation in Next.js.

---

### Question 30: What is `generateStaticParams`?

**Answer:** `generateStaticParams` pre-generates static pages for dynamic routes at build time. In `app/blog/[slug]/page.tsx`, export `async function generateStaticParams() { return [{ slug: 'post-1' }, { slug: 'post-2' }] }`. Next.js builds those paths statically. Combine with `revalidate` for Incremental Static Regeneration on paths not pre-built. Essential for static blogs and product pages with known slugs.

---

### Question 31: What is `generateMetadata`?

**Answer:** `generateMetadata` exports dynamic metadata (title, description, Open Graph tags) for Search Engine Optimization. It runs on the server and can fetch data: `export async function generateMetadata({ params }) { const post = await getPost(params.slug); return { title: post.title, description: post.excerpt } }`. Replaces manual `<Head>` usage from the Pages Router. Supports static and dynamic metadata per route.

---

### Question 32: How does Next.js help with Search Engine Optimization (SEO)?

**Answer:** Server-rendered HTML is fully crawlable by search engines. `generateMetadata` sets titles, descriptions, and social cards. Static generation gives fast page loads (ranking factor). Automatic sitemaps via `app/sitemap.ts`. Structured data in Server Components. Image optimization improves Core Web Vitals. Compared to client-only React, Next.js pages index reliably and load faster.

---

### Question 33: What are Core Web Vitals and how does Next.js improve them?

**Answer:** Core Web Vitals are Google's user experience metrics: Largest Contentful Paint (LCP — loading speed), Interaction to Next Paint (INP — responsiveness), Cumulative Layout Shift (CLS — visual stability). Next.js helps via: `next/image` and `next/font` for LCP/CLS, Server Components for smaller JavaScript bundles (faster INP), streaming for early content, and automatic code splitting per route.

---

### Question 34: What is the `next.config.js` file?

**Answer:** `next.config.js` (or `.mjs`/`.ts`) configures Next.js behavior: redirects, rewrites, headers, image domains, environment variables exposed to the browser, experimental features, and output mode (`standalone` for Docker). Example: allow images from `images.remotePatterns`, set `basePath` for deploying under a subpath, or enable `reactStrictMode` for development checks.

---

### Question 35: What is the `standalone` output mode?

**Answer:** `output: 'standalone'` in `next.config.js` creates a minimal self-contained build in `.next/standalone` with only necessary files for production — ideal for Docker containers. It traces dependencies and copies only what is needed, reducing image size compared to copying all of `node_modules`. Pair with a multi-stage Dockerfile for efficient deployments.

---

### Question 36: How do you deploy a Next.js app?

**Answer:** Common options: (1) Vercel — zero-config, built by Next.js creators, edge functions and analytics included. (2) Docker on AWS, Google Cloud, or Azure — use `standalone` output. (3) Node.js server — `next build && next start`. (4) Static export — `output: 'export'` for fully static sites on any static host (no Server-Side Rendering). Choose based on need for server features vs static hosting cost.

---

### Question 37: What is Partial Prerendering (PPR)?

**Answer:** Partial Prerendering (experimental) combines static and dynamic content on the same page. The static shell (header, layout) is pre-rendered at build time; dynamic holes (personalized content) stream in at request time. You wrap dynamic parts in `<Suspense>`. Goal: static speed with dynamic personalization — best of Static Site Generation and Server-Side Rendering on one page.

---

### Question 38: What are parallel routes in Next.js?

**Answer:** Parallel routes use the `@folder` convention to render multiple pages in the same layout simultaneously — e.g., `@analytics` and `@team` slots in a dashboard. Each slot has its own `loading.tsx` and `error.tsx`. Useful for split views, modals (`@modal`), and independent loading of dashboard panels. Defined in the layout: `{ children, analytics, team }`.

---

### Question 39: What are intercepting routes?

**Answer:** Intercepting routes load a route inside the current layout while keeping the URL — common for photo gallery modals. Use `(.)` to intercept at the same level, `(..)` one level up. Example: clicking a photo on `/feed` opens `/photo/1` as a modal overlay; refreshing shows the full page. Combines with parallel routes `@modal` for polished user experience patterns.

---

### Question 40: What is the Edge Runtime vs Node.js Runtime?

**Answer:** Next.js supports two runtimes. Node.js Runtime (default) — full Node.js APIs, suitable for database connections and heavy logic. Edge Runtime — lightweight V8 isolates at CDN edge locations, faster cold starts, limited APIs (no native Node modules), ideal for Middleware and low-latency redirects. Choose Edge for auth checks and geolocation; Node.js for complex server logic.

---

### Question 41: How do environment variables work in Next.js?

**Answer:** Store secrets in `.env.local` (gitignored). Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser; all others are server-only. Access via `process.env.MY_SECRET` in Server Components and API routes. Never put database passwords or API keys in `NEXT_PUBLIC_` variables. Use `.env.development`, `.env.production` for environment-specific values.

---

### Question 42: What is `next/headers` and `next/cookies`?

**Answer:** `headers()` and `cookies()` from `next/headers` read request headers and cookies in Server Components and Server Actions. They are async in Next.js 15+. Using them opts the route into dynamic rendering because values vary per request. Example: read auth token from cookies to personalize a dashboard. These replace accessing `req.headers` from Pages Router `getServerSideProps`.

---

### Question 43: What changed in Next.js 15?

**Answer:** Next.js 15 (2024) highlights: `fetch` requests no longer cached by default (dynamic by default), async request APIs (`cookies()`, `headers()`, `params`, `searchParams`), Turbopack stable for development, improved caching semantics with `staleTimes`, React 19 support, and `@next/codemod` for upgrading. Understand default caching changes when migrating from Next.js 14.

---

### Question 44: What is Turbopack?

**Answer:** Turbopack is Vercel's Rust-based bundler, successor to Webpack for development. It offers faster local development startup and Hot Module Replacement (HMR) — especially in large codebases. Enable with `next dev --turbopack`. Production builds still use Webpack by default (Turbopack for production is evolving). It is the default dev bundler direction for Next.js.

---

### Question 45: How do you handle internationalization (i18n) in the App Router?

**Answer:** App Router i18n is often implemented manually: use a `[locale]` dynamic segment (`app/[locale]/page.tsx`), middleware to detect locale from headers or cookies, and a dictionary file for translations. Libraries like `next-intl` simplify this. Unlike Pages Router built-in i18n config, App Router gives more flexibility but requires setup. Middleware redirects `/` to `/en` or `/hi` based on preference.

---

### Question 46: What is the difference between redirect and rewrite in `next.config.js`?

**Answer:** A redirect sends the browser to a new URL (user sees URL change) — use for moved pages or www to non-www. A rewrite serves content from another path internally (URL stays the same) — use for proxying APIs or friendly URLs. Redirect: `{ source: '/old', destination: '/new', permanent: true }`. Rewrite: `{ source: '/api/:path*', destination: 'https://backend.com/:path*' }`.

---

### Question 47: How do you test a Next.js application?

**Answer:** Unit test components with Jest/Vitest and React Testing Library. Test API routes by calling handler functions directly. End-to-end tests with Playwright or Cypress against `next dev` or production build. Test Server Components by testing the async function output. Mock `fetch` and database calls. Next.js docs recommend Playwright for integration tests including navigation and server rendering.

---

### Question 48: What are common Next.js performance mistakes?

**Answer:** (1) Marking entire pages `'use client'` when only a button needs interactivity. (2) Fetching in Client Components with `useEffect` instead of Server Components. (3) Not using `next/image` for large images. (4) Disabling prefetch unnecessarily. (5) Large client bundles from importing heavy libraries in Client Components. (6) Not using `loading.tsx` — users see blank screens. Fix by keeping Server Components default and profiling with Lighthouse.

---

### Question 49: Pages Router: explain `getServerSideProps` vs `getStaticProps`?

**Answer:** Still asked for legacy codebases. `getStaticProps` runs at build time — generates static HTML (Static Site Generation). `getServerSideProps` runs on every request — fresh data (Server-Side Rendering). `getStaticProps` with `revalidate` enables Incremental Static Regeneration. In App Router, these map to default static fetch vs `cache: 'no-store'` vs `revalidate` — but know the Pages Router names for interviews on older projects.

---

### Question 50: How would you architect a MERN-style app with Next.js?

**Answer:** Use Next.js as the full stack: React Server Components for data-heavy pages fetching from MongoDB directly or via internal API; Client Components for interactive forms and dashboards; Route Handlers or Server Actions for mutations; Middleware for auth; `next/image` for media; deploy on Vercel or Docker. MongoDB connection pooled in a shared `lib/mongodb.ts` module. Separate Express only if you need WebSockets or microservices — Next.js often replaces Express for standard REST apps.
