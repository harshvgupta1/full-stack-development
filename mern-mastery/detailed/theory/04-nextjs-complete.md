# Next.js 14 App Router — Complete Theory Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 5 Oct 2026 – 11 Oct 2026 (Days 50–56)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Goal:** Master Next.js 14 App Router for production MERN stacks — rendering strategies, server/client components, routing, data fetching, API routes, middleware, auth, SEO, and deployment.

---

## Table of Contents

1. [Why Next.js?](#1-why-nextjs)
2. [App Router Architecture](#2-app-router-architecture)
3. [Rendering Strategies: SSR, SSG, ISR, CSR](#3-rendering-strategies-ssr-ssg-isr-csr)
4. [Server vs Client Components](#4-server-vs-client-components)
5. [Routing Deep Dive](#5-routing-deep-dive)
6. [Data Fetching Patterns](#6-data-fetching-patterns)
7. [API Routes (Route Handlers)](#7-api-routes-route-handlers)
8. [Middleware](#8-middleware)
9. [Authentication Patterns](#9-authentication-patterns)
10. [SEO & Metadata](#10-seo--metadata)
11. [Performance Optimization](#11-performance-optimization)
12. [Deployment](#12-deployment)
13. [Interview Q&A](#13-interview-qa)
14. [Practice Links & Resources](#14-practice-links--resources)

---

## 1. Why Next.js?

Next.js is a **React framework** that solves problems plain React cannot:

| Problem (CRA/Vite SPA) | Next.js Solution |
|------------------------|------------------|
| Poor SEO (empty HTML shell) | Server-rendered HTML with content |
| Slow first paint | Streaming SSR, automatic code splitting |
| No built-in routing | File-system App Router |
| Manual API setup | Route Handlers (`app/api/`) |
| Image optimization manual | `<Image>` component with lazy loading |
| No caching strategy | Built-in fetch cache, ISR, static generation |

**Companies using Next.js:** Vercel, Netflix, TikTok, Nike, Uber, Adobe.

**When to choose Next.js over Vite + React:**
- SEO matters (marketing, blogs, e-commerce)
- You need SSR/SSG/ISR
- Full-stack in one repo (API + frontend)
- Deploying to Vercel or edge platforms

---

## 2. App Router Architecture

Next.js 14 uses the **App Router** (`app/` directory). The legacy **Pages Router** (`pages/`) still works but App Router is the default for new projects.

```
app/
├── layout.tsx              # Root layout (HTML shell, providers)
├── page.tsx                # Route: /
├── loading.tsx             # Suspense fallback for /
├── error.tsx               # Error boundary for /
├── not-found.tsx           # 404 page
├── globals.css
├── (marketing)/            # Route group — no URL segment
│   ├── layout.tsx
│   ├── about/page.tsx      # /about
│   └── pricing/page.tsx    # /pricing
├── dashboard/
│   ├── layout.tsx          # Nested layout for /dashboard/*
│   ├── page.tsx            # /dashboard
│   ├── settings/page.tsx   # /dashboard/settings
│   └── [teamId]/
│       └── page.tsx        # /dashboard/abc123 (dynamic)
├── blog/
│   └── [slug]/
│       └── page.tsx        # /blog/my-post
├── api/
│   └── users/
│       └── route.ts        # GET/POST /api/users
└── middleware.ts           # Edge middleware (root level)
```

### Special Files Convention

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI wrapper; persists across navigation |
| `page.tsx` | Unique UI for a route segment |
| `loading.tsx` | Instant loading UI via React Suspense |
| `error.tsx` | Client error boundary for segment |
| `not-found.tsx` | Custom 404 for segment |
| `route.ts` | API endpoint (no UI) |
| `template.tsx` | Re-mounts on navigation (unlike layout) |
| `default.tsx` | Parallel route fallback |

### Route Groups & Parallel Routes

```tsx
// app/(auth)/login/page.tsx  → URL is /login (group name hidden)
// app/(auth)/register/page.tsx → URL is /register

// Parallel routes — render multiple pages in one layout
// app/dashboard/@analytics/page.tsx
// app/dashboard/@team/page.tsx
// app/dashboard/layout.tsx receives { analytics, team } as props
```

---

## 3. Rendering Strategies: SSR, SSG, ISR, CSR

Understanding rendering is the **#1 Next.js interview topic**.

### Comparison Table

| Strategy | Full Name | When HTML is Built | Cache | Use Case |
|----------|-----------|-------------------|-------|----------|
| **SSG** | Static Site Generation | Build time | CDN forever | Blogs, docs, marketing |
| **SSR** | Server-Side Rendering | Every request | No cache (default) | Personalized dashboards |
| **ISR** | Incremental Static Regeneration | Build + revalidate | CDN + timed refresh | Product catalogs, news |
| **CSR** | Client-Side Rendering | Browser | None on server | Admin panels, auth-gated UI |
| **Streaming** | React Server Streaming | Request time, chunked | Partial | Large pages, slow data sources |

### SSG — Static Site Generation

```tsx
// app/products/page.tsx
export default async function ProductsPage() {
  const products = await fetch("https://api.example.com/products", {
    cache: "force-cache", // default — static at build time
  }).then(r => r.json());

  return (
    <ul>
      {products.map((p: Product) => (
        <li key={p.id}>{p.name} — ${p.price}</li>
      ))}
    </ul>
  );
}
```

### Dynamic SSG with `generateStaticParams`

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch("https://api.example.com/posts").then(r => r.json());
  return posts.map((post: Post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`, {
    cache: "force-cache",
  }).then(r => r.json());

  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;
}
```

### SSR — Server-Side Rendering

```tsx
// app/dashboard/page.tsx
export const dynamic = "force-dynamic"; // opt out of static caching

export default async function Dashboard() {
  const session = await getSession(); // cookies read on every request
  const data = await fetch("https://api.example.com/user-stats", {
    cache: "no-store", // SSR — fresh data every request
    headers: { Authorization: `Bearer ${session.token}` },
  }).then(r => r.json());

  return <DashboardView stats={data} user={session.user} />;
}
```

### ISR — Incremental Static Regeneration

```tsx
// app/news/page.tsx
export default async function NewsPage() {
  const articles = await fetch("https://api.example.com/news", {
    next: { revalidate: 300 }, // regenerate every 5 minutes
  }).then(r => r.json());

  return <NewsList articles={articles} />;
}

// On-demand ISR — purge cache programmatically
// POST /api/revalidate?path=/news&secret=TOKEN
import { revalidatePath } from "next/cache";
revalidatePath("/news");
```

### CSR — Client-Side Rendering

```tsx
"use client";
import useSWR from "swr";

export default function LivePrices() {
  const { data, error, isLoading } = useSWR("/api/prices", fetcher, {
    refreshInterval: 5000,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <PriceTable prices={data} />;
}
```

### Decision Flowchart (Mental Model)

```
Is content the same for all users?
├── YES → Is it okay to be stale for N seconds?
│   ├── YES → ISR (revalidate: N)
│   └── NO  → SSG with on-demand revalidation
└── NO  → Does it need SEO?
    ├── YES → SSR (cache: "no-store")
    └── NO  → CSR (client component + SWR/React Query)
```

---

## 4. Server vs Client Components

**Default in App Router: every component is a Server Component** unless marked with `"use client"`.

### Feature Comparison

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| Runs on | Server only | Server (SSR) + Browser |
| JavaScript sent to browser | None | Full component JS |
| `useState`, `useEffect` | ❌ | ✅ |
| Event handlers (`onClick`) | ❌ | ✅ |
| Browser APIs (`window`, `localStorage`) | ❌ | ✅ |
| Direct DB/API access | ✅ | ❌ (use API routes) |
| `async/await` in component | ✅ | ❌ |
| Secrets in code | ✅ (never exposed) | ❌ (visible in bundle) |
| Context providers | ❌ (can't use) | ✅ |

### Composition Pattern (Best Practice)

```tsx
// app/page.tsx — Server Component
import { ClientCounter } from "./ClientCounter";
import { fetchProducts } from "@/lib/db";

export default async function HomePage() {
  const products = await fetchProducts(); // server-only DB call

  return (
    <main>
      <h1>Products</h1>
      <ProductGrid products={products} />  {/* Server Component */}
      <ClientCounter />                     {/* Client island */}
    </main>
  );
}
```

```tsx
// app/ClientCounter.tsx
"use client";
import { useState } from "react";

export function ClientCounter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}
```

### Passing Data: Server → Client

```tsx
// ✅ Serializable props only (JSON-safe)
<ClientChart data={chartData} userId={user.id} />

// ❌ Cannot pass functions, classes, or Date objects directly
<ClientChart onSelect={(id) => {}} /> // Error!
```

### When to Use `"use client"`

| Use Server Component | Use Client Component |
|---------------------|---------------------|
| Fetch data | Forms with controlled inputs |
| Access backend resources | Interactive UI (modals, dropdowns) |
| Keep sensitive info on server | Browser APIs |
| Reduce JS bundle size | Custom hooks |
| Static content display | Third-party libs needing browser |

---

## 5. Routing Deep Dive

### Dynamic Segments

```tsx
// app/shop/[category]/[productId]/page.tsx
interface PageProps {
  params: { category: string; productId: string };
  searchParams: { sort?: string; page?: string };
}

export default function ProductPage({ params, searchParams }: PageProps) {
  // URL: /shop/electronics/abc123?sort=price&page=2
  return <div>{params.category} / {params.productId}</div>;
}
```

### Catch-All & Optional Catch-All

```tsx
// app/docs/[...slug]/page.tsx
// Matches: /docs/a, /docs/a/b, /docs/a/b/c
export default function DocsPage({ params }: { params: { slug: string[] } }) {
  return <div>Path: {params.slug.join("/")}</div>;
}

// app/shop/[[...slug]]/page.tsx — optional catch-all
// Matches: /shop AND /shop/a/b
```

### Navigation APIs

```tsx
"use client";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();       // "/dashboard"
  const searchParams = useSearchParams(); // ?tab=settings

  return (
    <>
      <Link href="/about" prefetch={true}>About</Link>
      <button onClick={() => router.push("/dashboard?tab=settings")}>
        Go to Settings
      </button>
      <button onClick={() => router.back()}>Back</button>
    </>
  );
}
```

### `<Link>` vs `router.push`

| Method | Prefetch | Use When |
|--------|----------|----------|
| `<Link>` | Yes (viewport) | Standard navigation |
| `router.push()` | No | Programmatic after action |
| `router.replace()` | No | Redirect without history entry |
| `redirect()` (server) | N/A | Server-side redirect |

```tsx
// Server-side redirect
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <Profile user={session.user} />;
}
```

### Route Handlers vs Pages

| App Router | Pages Router (legacy) |
|------------|----------------------|
| `app/api/users/route.ts` | `pages/api/users.ts` |
| Named exports: `GET`, `POST` | Default export handler |
| Web Request/Response API | Node req/res objects |

---

## 6. Data Fetching Patterns

### Fetch Cache Options (Next.js 14)

```tsx
// 1. Static (SSG) — cached indefinitely
fetch(url, { cache: "force-cache" });

// 2. Dynamic (SSR) — never cached
fetch(url, { cache: "no-store" });

// 3. ISR — cached with revalidation
fetch(url, { next: { revalidate: 60 } });

// 4. Tag-based revalidation
fetch(url, { next: { tags: ["products"] } });
// Later: revalidateTag("products");
```

### Parallel Data Fetching

```tsx
export default async function DashboardPage() {
  // ❌ Sequential — slower
  const user = await fetchUser();
  const orders = await fetchOrders(user.id);

  // ✅ Parallel — faster
  const [user, orders, notifications] = await Promise.all([
    fetchUser(),
    fetchOrders(),
    fetchNotifications(),
  ]);

  return <Dashboard user={user} orders={orders} notifications={notifications} />;
}
```

### React `cache()` for Request Deduplication

```tsx
import { cache } from "react";

export const getUser = cache(async (id: string) => {
  const res = await fetch(`https://api.example.com/users/${id}`);
  return res.json();
});

// Called multiple times in one request → only one fetch
export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  const posts = await getPostsByUser(params.id);
  return <Profile user={user} posts={posts} />;
}
```

### Server Actions (Mutations)

```tsx
// app/actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
});

export async function createPost(formData: FormData) {
  const parsed = CreatePostSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  await db.post.create({ data: parsed.data });
  revalidatePath("/blog");
  return { success: true };
}
```

```tsx
// app/blog/new/page.tsx
import { createPost } from "@/app/actions";

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Body" required />
      <button type="submit">Publish</button>
    </form>
  );
}
```

### External Libraries (Prisma, Drizzle)

```tsx
// lib/db.ts — server-only module
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## 7. API Routes (Route Handlers)

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");

  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ users, page, limit });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({ data: parsed.data });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### Dynamic API Routes

```tsx
// app/api/users/[id]/route.ts
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.user.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
```

### Route Handler Config

```tsx
// Force dynamic — never cache this route
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // or "edge"
export const maxDuration = 30;   // seconds (Vercel Pro)
```

---

## 8. Middleware

Middleware runs **before** a request completes — at the **Edge** runtime.

```tsx
// middleware.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = await verifyJWT(token);
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.sub);
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/protected/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### Middleware Use Cases

| Use Case | Implementation |
|----------|----------------|
| Auth guard | Redirect unauthenticated users |
| A/B testing | Rewrite to variant URL |
| Geolocation | Redirect by country header |
| Rate limiting | Return 429 before hitting API |
| Bot protection | Block suspicious user agents |
| i18n | Rewrite `/en/about` → locale segment |

### Middleware Limitations

- Runs on Edge — no Node.js APIs (`fs`, native modules)
- Cannot read request body
- Keep logic lightweight (adds latency to every matched request)

---

## 9. Authentication Patterns

### Pattern Comparison

| Pattern | Library | Best For |
|---------|---------|----------|
| NextAuth.js (Auth.js) | `@auth/core` | OAuth + credentials, sessions |
| Clerk | `@clerk/nextjs` | Managed auth, quick setup |
| Lucia | `lucia-auth` | Custom sessions, full control |
| JWT in httpOnly cookie | Custom | API-first, mobile clients |

### Auth.js (NextAuth v5) Example

```tsx
// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const user = await validateUser(credentials);
        return user ?? null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string;
      return session;
    },
  },
});
```

```tsx
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

```tsx
// Protect server component
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <div>Hello {session.user.name}</div>;
}
```

### Session Security Checklist

| Rule | Why |
|------|-----|
| Store JWT in `httpOnly` cookie | Prevents XSS token theft |
| Set `Secure` flag in production | HTTPS only |
| Set `SameSite=Lax` or `Strict` | CSRF protection |
| Short expiry + refresh token | Limits damage if stolen |
| Never store tokens in localStorage | Accessible to any JS |

---

## 10. SEO & Metadata

### Static Metadata

```tsx
// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | MyApp",
  description: "Learn about our mission and team.",
  openGraph: {
    title: "About Us",
    description: "Learn about our mission.",
    url: "https://myapp.com/about",
    siteName: "MyApp",
    images: [{ url: "https://myapp.com/og-about.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description: "Learn about our mission.",
    images: ["https://myapp.com/og-about.png"],
  },
  robots: { index: true, follow: true },
};
```

### Dynamic Metadata

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await fetchPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}
```

### Structured Data (JSON-LD)

```tsx
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
```

### SEO Checklist

| Item | Implementation |
|------|----------------|
| Unique `<title>` per page | `metadata.title` |
| Meta description | `metadata.description` |
| Canonical URL | `metadata.alternates.canonical` |
| Open Graph tags | `metadata.openGraph` |
| Sitemap | `app/sitemap.ts` |
| Robots.txt | `app/robots.ts` |
| Semantic HTML | `<main>`, `<article>`, `<h1>` hierarchy |
| Core Web Vitals | Image optimization, font loading |

```tsx
// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();
  return [
    { url: "https://myapp.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...posts.map(post => ({
      url: `https://myapp.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
```

---

## 11. Performance Optimization

### Image Optimization

```tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={600}
  priority                    // LCP image — preload
  placeholder="blur"
  blurDataURL={blurDataUrl}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Font Optimization

```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Streaming with Suspense

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <main>
      <Hero /> {/* renders immediately */}
      <Suspense fallback={<Skeleton />}>
        <SlowDataComponent /> {/* streams when ready */}
      </Suspense>
    </main>
  );
}
```

### Bundle Analysis

```bash
# Analyze bundle size
npm install @next/bundle-analyzer
# next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: process.env.ANALYZE === "true" });
module.exports = withBundleAnalyzer({});
```

| Optimization | Impact |
|-------------|--------|
| Server Components | Smaller client bundle |
| Dynamic imports | Code-split heavy libs |
| `next/image` | Automatic WebP/AVIF |
| `next/font` | Zero layout shift |
| Streaming SSR | Faster TTFB |
| Route prefetching | Instant navigation |

---

## 12. Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel          # preview
vercel --prod   # production
```

### Environment Variables

```bash
# .env.local (never commit)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Vercel dashboard → Settings → Environment Variables
# Set for: Production, Preview, Development
```

### `next.config.js` Production Settings

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.example.com" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
  ],
};

module.exports = nextConfig;
```

### Deployment Platform Comparison

| Platform | SSR | Edge | Cost | Best For |
|----------|-----|------|------|----------|
| Vercel | ✅ | ✅ | Free tier | Next.js native |
| Netlify | ✅ | ✅ | Free tier | JAMstack |
| AWS Amplify | ✅ | ❌ | Pay-as-go | AWS ecosystem |
| Docker + VPS | ✅ | ❌ | Fixed cost | Full control |
| Railway | ✅ | ❌ | Usage-based | Simple backend |

### Docker Deployment

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 13. Interview Q&A

### Q1: What is the difference between SSR, SSG, and ISR?

**Answer:** SSG builds HTML at **build time** — fastest, cached on CDN, same for all users. SSR builds HTML on **every request** — fresh, personalized, slower. ISR is SSG with a **revalidation timer** — static speed with periodic updates. Choose SSG for docs, SSR for user dashboards, ISR for product pages that change occasionally.

### Q2: When do you use Server vs Client Components?

**Answer:** Default to Server Components for data fetching, SEO content, and zero-JS UI. Use Client Components only when you need interactivity (`useState`, event handlers), browser APIs, or third-party client libraries. Compose by keeping client islands small inside server layouts.

### Q3: How does Next.js caching work in App Router?

**Answer:** Next.js 14 has four cache layers: (1) Request memoization — deduplicates fetch in one render, (2) Data Cache — stores fetch results across requests, (3) Full Route Cache — caches rendered HTML/RSC payload, (4) Router Cache — client-side cache of visited routes. Control with `cache`, `revalidate`, and `revalidatePath/Tag`.

### Q4: What is middleware and when would you use it?

**Answer:** Middleware runs at the Edge before route handlers. Use it for auth checks, redirects, A/B tests, geolocation routing, and rate limiting. Keep it stateless and fast — it runs on every matched request. Cannot access DB directly; use JWT verification or edge-compatible stores.

### Q5: How do Server Actions differ from API routes?

**Answer:** Server Actions are `"use server"` functions called directly from forms or event handlers — no fetch boilerplate, automatic CSRF protection, progressive enhancement. API routes are REST endpoints for external clients, webhooks, or mobile apps. Use Server Actions for internal mutations; API routes for public/external APIs.

### Q6: How do you optimize Core Web Vitals in Next.js?

**Answer:** LCP — use `priority` on hero images, server-render above-fold content. CLS — use `next/font`, explicit image dimensions. INP — minimize client JS, use Server Components, code-split heavy components. Also: streaming SSR, prefetching with `<Link>`, and ISR for static content.

### Q7: Explain the App Router file conventions.

**Answer:** `layout.tsx` wraps child routes and persists state. `page.tsx` defines the UI for a route. `loading.tsx` provides Suspense fallback. `error.tsx` is a client error boundary. `route.ts` defines API endpoints. `generateStaticParams` pre-builds dynamic routes. Route groups `(folder)` organize without affecting URL.

### Q8: How do you handle authentication in Next.js 14?

**Answer:** Use Auth.js for OAuth + sessions, or JWT in httpOnly cookies for custom auth. Protect routes via middleware (redirect) or server component checks (`auth()` + `redirect()`). Never store tokens in localStorage. Use Server Actions or API routes for login/logout. Pass session data to Client Components as serializable props only.

---

## 14. Practice Links & Resources

### Official Documentation
- [Next.js 14 Docs](https://nextjs.org/docs) — App Router reference
- [Next.js Learn Course](https://nextjs.org/learn) — Interactive tutorial
- [React Server Components](https://react.dev/reference/rsc/server-components) — RSC spec

### Practice Projects
| Project | Skills Covered |
|---------|---------------|
| Blog with MDX + ISR | SSG, dynamic routes, metadata |
| E-commerce storefront | ISR, Server Actions, cart state |
| Dashboard with auth | SSR, middleware, protected routes |
| URL shortener | API routes, edge middleware |
| Real-time chat | Client components, WebSockets |

### Tools
- [Vercel Templates](https://vercel.com/templates/next.js) — Starter projects
- [shadcn/ui](https://ui.shadcn.com) — Copy-paste components for Next.js
- [T3 Stack](https://create.t3.gg) — Next.js + tRPC + Prisma + Tailwind

### Interview Prep
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions) — Architecture decisions
- [Patterns.dev](https://www.patterns.dev) — Rendering patterns
- Build and deploy 2–3 full Next.js projects before interviews

---

*Next file: [05-nodejs-express-complete.md](./05-nodejs-express-complete.md)*
