# HTML, CSS & Web Fundamentals — Complete Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 14 Sep 2026 – 15 Sep 2026 (Days 29–30)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Phase 0** — Read BEFORE React (Days 29–30 or earlier).  
> **Prerequisites:** None.  
> **Unlocks:** React (03), Next.js (04).

---

## Why this exists (don't skip)

React is **not** a replacement for HTML/CSS — it generates HTML. At 80 LPA interviews you will be asked:
- How does the browser render a page?
- What is the CSS box model?
- Why does CORS exist?
- Difference between `<div>` and semantic HTML?

Skipping this causes confusion with JSX, styling, SSR hydration, and frontend system design.

---

## 1. How the Web Works

```
User types URL
    → DNS resolves domain to IP
    → TCP connection to server
    → HTTP request (GET /index.html)
    → Server responds (200 OK + HTML)
    → Browser parses HTML → DOM tree
    → Browser parses CSS → CSSOM tree
    → Render tree → Layout → Paint → Composite
    → JavaScript downloads and executes
```

| Term | Meaning |
|------|---------|
| **DNS** | Phone book: `google.com` → `142.250.x.x` |
| **TCP** | Reliable delivery of data packets |
| **HTTP** | Request/response protocol on top of TCP |
| **DOM** | Tree representation of HTML in memory |
| **CSSOM** | Tree representation of CSS |

---

## 2. HTML Essentials

### Document structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
  <script src="app.js"></script>
</body>
</html>
```

### Semantic tags (use these, not div soup)

| Tag | Use for |
|-----|---------|
| `<header>` | Page/section header |
| `<nav>` | Navigation links |
| `<main>` | Primary content (one per page) |
| `<article>` | Self-contained content |
| `<section>` | Thematic grouping |
| `<aside>` | Sidebar, related content |
| `<footer>` | Footer |
| `<figure>` / `<figcaption>` | Images with captions |

### Forms (React forms build on this)

```html
<form action="/login" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <label for="password">Password</label>
  <input type="password" id="password" name="password" minlength="8">
  <button type="submit">Login</button>
</form>
```

### Important attributes

- `id` — unique identifier (CSS `#id`, JS `getElementById`)
- `class` — reusable styling (CSS `.class`)
- `data-*` — custom data attributes
- `aria-*` — accessibility

---

## 3. CSS Essentials

### Box model

```
┌─────────────── margin ───────────────┐
│  ┌─────────── border ─────────────┐  │
│  │  ┌──────── padding ────────┐  │  │
│  │  │  ┌──── content ────┐   │  │  │
│  │  │  │                 │   │  │  │
│  │  │  └─────────────────┘   │  │  │
│  │  └────────────────────────┘  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

```css
* { box-sizing: border-box; } /* always use this */

.card {
  width: 300px;
  padding: 16px;
  margin: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
```

### Flexbox (most used layout)

```css
.container {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  gap: 16px;
  flex-wrap: wrap;
}

.item {
  flex: 1; /* grow to fill space */
}
```

### CSS Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

### Responsive design

```css
/* Mobile first */
.sidebar { display: none; }

@media (min-width: 768px) {
  .sidebar { display: block; width: 250px; }
}
```

### CSS variables (used in theming)

```css
:root {
  --color-primary: #2563eb;
  --spacing-md: 16px;
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-md);
}
```

---

## 4. DOM & JavaScript in Browser

```javascript
// Select elements
document.getElementById("email");
document.querySelector(".card");
document.querySelectorAll("li");

// Modify
element.textContent = "Hello";
element.classList.add("active");
element.style.color = "red";

// Events
button.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked");
});

// Create elements
const div = document.createElement("div");
div.textContent = "New";
parent.appendChild(div);
```

**React replaces manual DOM manipulation** — but interviewers expect you to know what React abstracts.

---

## 5. Browser Storage

| API | Scope | Size | Use |
|-----|-------|------|-----|
| `localStorage` | Permanent | ~5MB | Theme preference |
| `sessionStorage` | Tab session | ~5MB | Form draft |
| `cookies` | Sent with HTTP | ~4KB | Auth tokens (httpOnly preferred) |
| IndexedDB | Permanent | Large | Offline apps |

---

## 6. Connection to React/Next.js

| Web fundamental | React equivalent |
|-----------------|------------------|
| `class="btn"` | `className="btn"` |
| `for="email"` | `htmlFor="email"` |
| `onclick` | `onClick` |
| Manual DOM updates | Virtual DOM + reconciliation |
| `<a href>` | `<Link href>` (Next.js) |
| CSS file | CSS Modules / Tailwind / styled-components |

---

## 7. Exercises

1. Build static resume page (HTML only) — semantic tags
2. Style with Flexbox — header, sidebar, main layout
3. Add dark mode with CSS variables
4. Form with validation (vanilla JS, no framework)
5. Recreate exercise 4 in React — compare code

**Where to practice:** freeCodeCamp Responsive Web Design, MDN HTML/CSS tutorials

---

## 8. Interview Q&A (with answers)

**Q: What happens when you type google.com in the browser?**  
**A:** DNS lookup resolves the domain to an IP address. Browser opens TCP connection (TLS handshake for HTTPS). Browser sends HTTP GET request. Server responds with HTML. Browser parses HTML into DOM, fetches CSS/JS resources in parallel. CSSOM + DOM → render tree → layout (calculate positions) → paint pixels → JavaScript executes and may modify DOM. Subsequent navigations may use HTTP cache or service worker.

**Q: Explain the CSS box model.**  
**A:** Every element is a rectangular box with content, padding, border, and margin layers. `box-sizing: content-box` (default) adds padding/border outside width. `border-box` includes padding and border in width — preferred for predictable layouts. Margin collapses vertically between adjacent block elements.

**Q: Flexbox vs Grid — when to use which?**  
**A:** Flexbox is one-dimensional (row OR column) — nav bars, centering, equal-height cards in a row. Grid is two-dimensional (rows AND columns) — page layouts, dashboards, complex grids. Often combined: Grid for page shell, Flexbox for components inside cells.

---

## 9. Gate to Phase 3 (React)

Before opening React PDF, you must:
- [ ] Build one static page with semantic HTML
- [ ] Use Flexbox for layout
- [ ] Explain box model aloud
- [ ] Know what DOM is vs Virtual DOM (preview)
