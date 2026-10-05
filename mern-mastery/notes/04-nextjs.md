# Next.js — Complete Notes

---

## 1. Why Next.js?

- **React framework** with routing, SSR, API routes built-in
- Used by Adobe, Uber, Netflix, TikTok
- **SEO** — server-rendered HTML
- **Performance** — automatic code splitting, image optimization

---

## 2. App Router vs Pages Router (use App Router)

```
app/
├── layout.tsx      ← shared layout (wraps all pages)
├── page.tsx        ← route: /
├── loading.tsx     ← loading UI
├── error.tsx       ← error boundary
├── users/
│   ├── page.tsx    ← route: /users
│   └── [id]/
│       └── page.tsx ← route: /users/123
└── api/
    └── users/
        └── route.ts ← API: GET/POST /api/users
```

---

## 3. Server vs Client Components

```tsx
// Server Component (default) — runs on server, no JS sent to client
async function UserList() {
  const users = await fetchUsers(); // direct DB/API call
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Client Component — interactivity, hooks, browser APIs
"use client";
import { useState } from "react";
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| useState/useEffect | No | Yes |
| Fetch on server | Yes | Possible but not ideal |
| Bundle size | Zero JS | Sent to browser |
| Event handlers | No | Yes |

---

## 4. Data Fetching

```tsx
// Server Component — fetch at request time
async function Page() {
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 }, // ISR — revalidate every 60s
  });
  const posts = await res.json();
  return <PostList posts={posts} />;
}
```

### Rendering strategies

| Strategy | When | How |
|----------|------|-----|
| **SSG** | Static content | `generateStaticParams` |
| **SSR** | Dynamic per request | `fetch` without cache |
| **ISR** | Static + periodic update | `revalidate: N` |
| **CSR** | Client-only data | Client component + useEffect/SWR |

---

## 5. API Route Handlers

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}
```

---

## 6. Middleware

```typescript
// middleware.ts — runs before every request
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

## 7. Metadata & SEO

```tsx
export const metadata = {
  title: "My App",
  description: "Best app ever",
  openGraph: { title: "My App", images: ["/og.png"] },
};
```

---

## 8. Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com  # exposed to browser
SECRET_KEY=xxx                                # server only
```

---

## 9. Deployment

- **Vercel** — zero-config Next.js hosting (recommended)
- **Docker** — self-hosted on AWS/GCP

---

## 10. Interview Topics

- SSR vs CSR vs SSG vs ISR — when to use each
- Server vs Client Components tradeoffs
- How Next.js improves SEO
- File-based routing
- Middleware use cases (auth, redirects, geo)
