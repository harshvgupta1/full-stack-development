# React 18 — Complete Guide (30 LPA MERN Bootcamp)

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 14 Sep 2026 – 4 Oct 2026 (Days 29–49)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Target level:** Senior frontend interviews at product companies. You must explain hooks internals, reconciliation, performance trade-offs, and React 18 concurrent features — not just syntax.

---

## Table of Contents

1. [What is React?](#1-what-is-react)
2. [JSX — Deep Dive](#2-jsx--deep-dive)
3. [Components & Composition](#3-components--composition)
4. [Props — Patterns & Pitfalls](#4-props--patterns--pitfalls)
5. [State — Local, Lifted, Derived](#5-state--local-lifted-derived)
6. [All Hooks In Depth](#6-all-hooks-in-depth)
7. [Forms — Controlled, Uncontrolled, Libraries](#7-forms--controlled-uncontrolled-libraries)
8. [Performance Optimization](#8-performance-optimization)
9. [Routing — React Router v6](#9-routing--react-router-v6)
10. [State Management](#10-state-management)
11. [Error Boundaries](#11-error-boundaries)
12. [React 18 Features](#12-react-18-features)
13. [Patterns & Anti-Patterns](#13-patterns--anti-patterns)
14. [15 Interview Q&A](#14-15-interview-qa)
15. [Where to Practice](#15-where-to-practice)

---

## 1. What is React?

React is a **declarative UI library** for building component trees. You describe *what* the UI should look like for a given state; React determines *how* to update the DOM efficiently.

### Core Concepts

| Concept | Description |
|---------|-------------|
| Components | Reusable UI units (functions returning JSX) |
| Props | Read-only inputs from parent to child |
| State | Mutable data owned by a component |
| Virtual DOM | In-memory tree; React diffs against previous render |
| Reconciliation | Algorithm comparing trees to compute minimal DOM updates |
| One-way data flow | Data flows down via props; events flow up via callbacks |

### React vs Framework

| | React | Next.js / Remix |
|---|-------|-----------------|
| Routing | Bring your own (React Router) | Built-in file-based |
| SSR | Via libraries | First-class |
| Data fetching | useEffect / TanStack Query | Server components, loaders |

> **Interview Box:** *"Is React a framework?"*  
> **Answer:** No — it's a view library. You choose router, state manager, and data layer. Next.js is a React *framework* that adds opinions.

---

## 2. JSX — Deep Dive

JSX is syntactic sugar for `React.createElement(type, props, ...children)`.

### 2.1 Basic Rules

```jsx
// Expression container
const name = "Priya";
const element = <h1 className="title">Hello, {name.toUpperCase()}</h1>;

// Attributes — camelCase in JS
<img src="/logo.png" alt="Logo" style={{ marginTop: 8 }} />

// Boolean props shorthand
<input disabled />          // disabled={true}
<Modal open={isOpen} />

// Fragments — no extra DOM node
<>
  <Header />
  <Main />
</>

// Keys in lists
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

### 2.2 JSX vs HTML Differences

| HTML | JSX |
|------|-----|
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `tabindex` | `tabIndex` |
| `style="color: red"` | `style={{ color: "red" }}` |
| Self-closing optional | Self-closing required (`<br />`) |

### 2.3 Conditional Rendering

```jsx
function StatusBadge({ status }) {
  // Ternary
  return status === "active" ? <span className="green">Active</span> : null;

  // Logical AND — careful: {count && <Badge />} renders "0" when count is 0
  // Fix: {count > 0 && <Badge count={count} />}

  // Early return
  if (!status) return null;
  return <span>{status}</span>;
}
```

### 2.4 Children Patterns

```jsx
function Layout({ header, sidebar, children }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

// Render prop
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return render(pos);
}
```

---

## 3. Components & Composition

### 3.1 Function Components (Standard)

```jsx
function Welcome({ name, age = 18 }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>Age: {age}</p>
    </div>
  );
}
```

### 3.2 TypeScript Props

```tsx
interface WelcomeProps {
  name: string;
  age?: number;
}

function Welcome({ name, age = 18 }: WelcomeProps) {
  return <h1>Hello, {name}</h1>;
}
```

### 3.3 Composition over Inheritance

```jsx
function Dialog({ title, children, footer }) {
  return (
    <div role="dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">{title}</h2>
      <div className="dialog-body">{children}</div>
      {footer && <div className="dialog-footer">{footer}</div>}
    </div>
  );
}

function ConfirmDialog({ message, onConfirm }) {
  return (
    <Dialog
      title="Confirm"
      footer={
        <>
          <button onClick={onConfirm}>Yes</button>
          <button>Cancel</button>
        </>
      }
    >
      <p>{message}</p>
    </Dialog>
  );
}
```

### 3.4 Compound Components

```jsx
const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabList({ children }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={active === id}
      onClick={() => setActive(id)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabPanel({ id, children }) {
  const { active } = useContext(TabsContext);
  if (active !== id) return null;
  return <div role="tabpanel">{children}</div>;
};
```

---

## 4. Props — Patterns & Pitfalls

### 4.1 Props Are Read-Only

```jsx
// ❌ Never mutate props
function Bad({ user }) {
  user.name = "hacked"; // Anti-pattern
}

// ✅ Clone or derive
function Good({ user, onUpdate }) {
  return <button onClick={() => onUpdate({ ...user, name: "new" })}>Edit</button>;
}
```

### 4.2 Prop Drilling vs Context

| Approach | When |
|----------|------|
| Props | 1–2 levels deep |
| Context | Theme, auth, locale — many consumers |
| State manager | Complex shared state with actions |

### 4.3 Spread Props

```jsx
function Input({ label, ...inputProps }) {
  return (
    <label>
      {label}
      <input {...inputProps} />
    </label>
  );
}
```

### 4.4 Default Props (Modern)

```jsx
// Prefer default parameters over defaultProps (deprecated for function components)
function Avatar({ size = 40, src, alt = "User avatar" }) {
  return <img width={size} height={size} src={src} alt={alt} />;
}
```

---

## 5. State — Local, Lifted, Derived

### 5.1 Local State

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // Functional update — safe when next state depends on previous
  const increment = () => setCount(c => c + 1);

  return <button onClick={increment}>{count}</button>;
}
```

### 5.2 Lifted State

When siblings need shared data, lift state to common ancestor.

```jsx
function TemperatureConverter() {
  const [celsius, setCelsius] = useState("");

  const fahrenheit =
    celsius === "" ? "" : String((Number(celsius) * 9) / 5 + 32);

  return (
    <>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitDisplay value={fahrenheit} />
    </>
  );
}
```

### 5.3 Derived State — Don't Duplicate

```jsx
// ❌ Bad — selectedItem stored AND derived from items
const [items, setItems] = useState([]);
const [selectedId, setSelectedId] = useState(null);
const selected = items.find(i => i.id === selectedId); // ✅ Derive, don't store
```

### 5.4 State Placement Decision Tree

```
Is this data needed by multiple unrelated branches?
├── Yes → Context / Zustand / Redux
└── No → Is it needed by siblings?
    ├── Yes → Lift to parent
    └── No → Local useState
```

---

## 6. All Hooks In Depth

### 6.1 Rules of Hooks

1. Only call at **top level** — not in loops, conditions, or nested functions.
2. Only call from **React function components** or **custom hooks**.

React relies on call order to associate state with each hook instance.

### 6.2 useState

```jsx
const [state, setState] = useState(initialValue);
const [state, setState] = useState(() => expensiveInit()); // lazy init
```

| Pattern | Example |
|---------|---------|
| Object state | `setUser(u => ({ ...u, name: "x" }))` |
| Array state | `setItems(prev => [...prev, newItem])` |
| Reset | `setCount(0)` |

### 6.3 useEffect

Runs **after paint** (async relative to render).

```jsx
useEffect(() => {
  // Effect body
  document.title = `Count: ${count}`;

  return () => {
    // Cleanup — before re-run or unmount
  };
}, [count]); // dependency array
```

| Dependency array | Behavior |
|------------------|----------|
| Omitted | Runs every render (rarely wanted) |
| `[]` | Runs once on mount |
| `[a, b]` | Runs when `a` or `b` change |

```jsx
// Fetch pattern
useEffect(() => {
  let cancelled = false;

  async function load() {
    const data = await fetchUser(id);
    if (!cancelled) setUser(data);
  }
  load();

  return () => { cancelled = true; };
}, [id]);
```

> **Interview Box:** *"useEffect vs useLayoutEffect?"*  
> **Answer:** `useLayoutEffect` fires synchronously after DOM mutations, before browser paint. Use for DOM measurements or preventing visual flicker. `useEffect` is default for data fetching and subscriptions.

### 6.4 useLayoutEffect

```jsx
useLayoutEffect(() => {
  const height = ref.current.getBoundingClientRect().height;
  setTooltipHeight(height);
}, []);
```

### 6.5 useRef

```jsx
function TextInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}

// Mutable box — doesn't trigger re-render
function Timer() {
  const intervalRef = useRef(null);
  const countRef = useRef(0);

  const start = () => {
    intervalRef.current = setInterval(() => {
      countRef.current += 1;
    }, 1000);
  };

  return <button onClick={start}>Start</button>;
}
```

### 6.6 useMemo

Memoizes **computed values**.

```jsx
const sortedItems = useMemo(
  () => items.slice().sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);
```

### 6.7 useCallback

Memoizes **function references** — useful when passing to memoized children.

```jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

return <MemoizedChild onClick={handleClick} />;
```

> **Interview Box:** *"When should you use useMemo/useCallback?"*  
> **Answer:** When profiling shows a problem, or when a stable reference is required (dependency arrays, React.memo children). Premature memoization adds complexity without benefit.

### 6.8 useReducer

Better for complex state transitions.

```jsx
const initialState = { items: [], loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, items: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function ItemList() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    fetchItems()
      .then(data => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch(err => dispatch({ type: "FETCH_ERROR", payload: err.message }));
  }, []);

  if (state.loading) return <Spinner />;
  if (state.error) return <Error message={state.error} />;
  return <ul>{state.items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}
```

### 6.9 useContext

```jsx
const ThemeContext = createContext("light");

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button className={theme} onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
      Toggle
    </button>
  );
}
```

**Performance note:** All consumers re-render when context value changes. Split contexts or use selectors (Zustand, Jotai).

### 6.10 useId

Stable IDs for accessibility — SSR-safe.

```jsx
function PasswordField() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Password</label>
      <input id={id} type="password" />
    </>
  );
}
```

### 6.11 useImperativeHandle

Expose limited imperative API via ref (with `forwardRef`).

```jsx
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => { if (inputRef.current) inputRef.current.value = ""; },
  }));

  return <input ref={inputRef} {...props} />;
});
```

### 6.12 useDeferredValue & useTransition (React 18)

```jsx
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const results = useMemo(
    () => filterHugeList(deferredQuery),
    [deferredQuery]
  );

  return (
    <ul style={{ opacity: isStale ? 0.6 : 1 }}>
      {results.map(r => <li key={r.id}>{r.name}</li>)}
    </ul>
  );
}

function TabContainer() {
  const [tab, setTab] = useState("home");
  const [isPending, startTransition] = useTransition();

  const selectTab = (next) => {
    startTransition(() => setTab(next));
  };

  return (
    <>
      {isPending && <Spinner />}
      <TabBar active={tab} onSelect={selectTab} />
      <TabContent tab={tab} />
    </>
  );
}
```

### 6.13 useSyncExternalStore

Subscribe to external stores (Redux, Zustand internals, browser APIs).

```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);
      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine,
    () => true // server snapshot
  );
}
```

### 6.14 Custom Hooks

```jsx
function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(r => r.json())
      .then(json => { if (!cancelled) setData(json); })
      .catch(err => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
```

### Hooks Quick Reference

| Hook | Purpose |
|------|---------|
| `useState` | Local state |
| `useEffect` | Side effects after render |
| `useLayoutEffect` | Sync DOM effects before paint |
| `useRef` | DOM ref / mutable value |
| `useMemo` | Memoize computed value |
| `useCallback` | Memoize function |
| `useReducer` | Complex state logic |
| `useContext` | Consume context |
| `useId` | Stable unique IDs |
| `useDeferredValue` | Defer expensive renders |
| `useTransition` | Mark updates non-urgent |
| `useSyncExternalStore` | External store subscription |

---

## 7. Forms — Controlled, Uncontrolled, Libraries

### 7.1 Controlled Components

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 7.2 Uncontrolled + useRef

```jsx
function QuickSearch() {
  const inputRef = useRef(null);

  const handleSearch = () => {
    const query = inputRef.current?.value;
    search(query);
  };

  return (
    <>
      <input ref={inputRef} defaultValue="" />
      <button onClick={handleSearch}>Search</button>
    </>
  );
}
```

### 7.3 React Hook Form (Production Standard)

```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function RegisterForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register("password")} />
      {errors.password && <span>{errors.password.message}</span>}
      <button disabled={isSubmitting}>Register</button>
    </form>
  );
}
```

| Approach | Pros | Cons |
|----------|------|------|
| Controlled | Full control, instant validation | Re-render per keystroke |
| Uncontrolled | Fewer renders | Harder validation UX |
| React Hook Form | Performance + validation | Extra dependency |

---

## 8. Performance Optimization

### 8.1 React.memo

```jsx
const ExpensiveList = memo(function ExpensiveList({ items, onSelect }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onSelect(item.id)}>{item.name}</li>
      ))}
    </ul>
  );
});
```

Shallow prop comparison — re-renders only when props change by reference/value.

### 8.2 Code Splitting

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Dashboard />
    </Suspense>
  );
}
```

### 8.3 Virtualization

For 10k+ row lists, use `@tanstack/react-virtual` or `react-window` — render only visible items.

### 8.4 Profiling Checklist

| Symptom | Fix |
|---------|-----|
| Slow initial load | Code split, tree-shake |
| Slow list scroll | Virtualize |
| Child re-renders on parent | `memo` + stable callbacks |
| Expensive computation | `useMemo` |
| Large context | Split context / selectors |

### 8.5 Reconciliation & Keys

```jsx
// ❌ Index as key when list reorders
{items.map((item, index) => <Row key={index} item={item} />)}

// ✅ Stable unique ID
{items.map(item => <Row key={item.id} item={item} />)}
```

Wrong keys cause incorrect state preservation and poor performance.

---

## 9. Routing — React Router v6

```jsx
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "users/:userId", element: <UserProfile /> },
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
    ],
  },
]);

function RootLayout() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Outlet />
    </>
  );
}

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      <h1>User {userId}</h1>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

function App() {
  return <RouterProvider router={router} />;
}
```

### Data Loading (v6.4+ loaders)

```jsx
{
  path: "users/:id",
  element: <User />,
  loader: async ({ params }) => {
    return fetchUser(params.id);
  },
}

function User() {
  const user = useLoaderData();
  return <h1>{user.name}</h1>;
}
```

---

## 10. State Management

### Decision Matrix

| Solution | Best for |
|----------|----------|
| `useState` / `useReducer` | Component-local |
| Context | Theme, auth, low-frequency global |
| Zustand | Medium apps — minimal boilerplate |
| Redux Toolkit | Large teams, time-travel, middleware |
| TanStack Query | Server state (API cache) |
| Jotai / Recoil | Atomic fine-grained updates |

### Zustand Example

```jsx
import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [],
  addItem: (product) =>
    set((state) => ({ items: [...state.items, product] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  total: () => useCartStore.getState().items.reduce((s, i) => s + i.price, 0),
}));
```

### TanStack Query — Server State

```jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 60_000,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
  );
}
```

> **Interview Box:** *"Client state vs server state?"*  
> **Answer:** Client state lives in UI (modal open, form draft). Server state is fetched, cached, and can be stale. Don't put API data in Redux if TanStack Query handles cache, refetch, and deduplication.

---

## 11. Error Boundaries

Class components only (no hook equivalent yet).

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
  <AppRoutes />
</ErrorBoundary>
```

**Limitations:** Error boundaries don't catch event handler errors, async errors, or SSR errors — use try/catch there.

```jsx
async function handleSubmit() {
  try {
    await saveData();
  } catch (err) {
    setError(err.message);
  }
}
```

---

## 12. React 18 Features

### 12.1 Automatic Batching

Multiple state updates in event handlers, promises, and timeouts batch into one re-render.

```jsx
// React 18 — one re-render
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
```

### 12.2 Concurrent Rendering

React can interrupt low-priority renders. Enables `useTransition`, `useDeferredValue`, and Suspense improvements.

### 12.3 Strict Mode (Development)

Double-invokes effects and renders to surface side-effect bugs.

```jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### 12.4 New Root API

```jsx
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

### 12.5 Suspense Improvements

SSR streaming, selective hydration — used heavily in Next.js App Router.

| Feature | Benefit |
|---------|---------|
| `useTransition` | Keep UI responsive during heavy updates |
| `useDeferredValue` | Lag behind fast input for expensive derived UI |
| Streaming SSR | Send HTML shell first, stream components |
| Automatic batching | Fewer renders, better perf |

---

## 13. Patterns & Anti-Patterns

### ✅ Recommended Patterns

| Pattern | Use case |
|---------|----------|
| Container/Presentational | Separate data fetching from UI |
| Custom hooks | Reuse stateful logic |
| Compound components | Flexible APIs (Tabs, Select) |
| Lifting state up | Shared sibling state |
| Render props / children fn | Inject behavior |
| Error boundaries | Graceful failure UI |
| Suspense + lazy | Route-level code splitting |

### ❌ Anti-Patterns

| Anti-pattern | Why it's bad | Fix |
|--------------|--------------|-----|
| Mutating state | No re-render, broken UI | Spread / immutable updates |
| Index as key (dynamic lists) | Wrong component state | Stable unique keys |
| useEffect for everything | Race conditions, stale closures | Event handlers, TanStack Query |
| Prop drilling 5+ levels | Unmaintainable | Context / store |
| Giant components | Untestable | Split by responsibility |
| Derived state in useEffect | Extra render cycle | Compute during render |
| `{count && <X />}` when count can be 0 | Renders "0" | `count > 0 &&` |
| Missing cleanup in useEffect | Memory leaks | Return cleanup function |

```jsx
// ❌ Syncing props to state — usually wrong
function Bad({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  // Fine for fetch — but NOT: useEffect(() => setName(propName), [propName])
}
```

---

## 14. 15 Interview Q&A

> **Q1: Virtual DOM — how does reconciliation work?**  
> React builds a fiber tree. On state change, it creates a new tree, diffs with previous (same type → update props; different type → replace subtree), batches DOM writes.

> **Q2: Why must keys be stable and unique?**  
> Keys help React match list items across renders. Unstable keys cause remounts, lost local state, and incorrect animations.

> **Q3: Controlled vs uncontrolled components?**  
> Controlled: React state is source of truth (`value` + `onChange`). Uncontrolled: DOM holds state (`defaultValue`, refs).

> **Q4: Explain the useEffect dependency array.**  
> ESLint `exhaustive-deps` ensures values used inside the effect are listed. Missing deps → stale closures; over-listing → extra runs.

> **Q5: What causes unnecessary re-renders?**  
> Parent re-render, new object/function props each render, context changes. Fix with memoization, composition, or state colocation.

> **Q6: useMemo vs useCallback?**  
> `useMemo` caches values; `useCallback` caches functions. `useCallback(fn, deps)` ≡ `useMemo(() => fn, deps)`.

> **Q7: When to use useReducer over useState?**  
> Multiple related state fields, complex transitions, next state depends on previous in non-trivial ways, or testing reducer in isolation.

> **Q8: What is prop drilling and how do you fix it?**  
> Passing props through many intermediate components. Fix with Context, component composition (children), or a state library.

> **Q9: Error boundaries — what do they NOT catch?**  
> Errors in event handlers, async code (setTimeout, promises), SSR, or errors in the boundary itself.

> **Q10: React 18 automatic batching?**  
> All updates in the same event loop tick batch — including promises and native event handlers — reducing re-renders.

> **Q11: useTransition vs useDeferredValue?**  
> `useTransition` wraps state updates you initiate. `useDeferredValue` defers a value you're consuming (often from props/state).

> **Q12: How does Strict Mode help?**  
> Double-mounts components in dev to expose missing effect cleanups and non-idempotent side effects.

> **Q13: Why prefer TanStack Query for API data?**  
> Built-in caching, deduplication, background refetch, stale-while-revalidate, loading/error states — avoids reinventing in useEffect.

> **Q14: forwardRef — when needed?**  
> When parent needs DOM ref to child internal element (focus, measure). Function components don't expose refs by default.

> **Q15: How would you optimize a 10,000-item list?**  
> Virtualization, pagination, memoized row components, stable keys, avoid inline functions in render if rows are memoized, Web Workers for filtering if CPU-bound.

---

## 15. Where to Practice

### Official Documentation

| Resource | URL | Notes |
|----------|-----|-------|
| React Docs (current) | [react.dev](https://react.dev/) | Canonical — hooks, thinking in React |
| Legacy beta docs | [beta.reactjs.org](https://beta.reactjs.org/) | Redirects to react.dev; some old links |
| React Blog | [react.dev/blog](https://react.dev/blog) | React 18, Server Components announcements |

### Hands-On Projects

| Platform | URL | Focus |
|----------|-----|-------|
| Frontend Mentor | [frontendmentor.io](https://www.frontendmentor.io/) | Real-world UI challenges with designs |
| React Challenges | [github.com/alexgurr/react-coding-challenges](https://github.com/alexgurr/react-coding-challenges) | Hooks, patterns |
| Epic React (Kent C. Dodds) | [epicreact.dev](https://epicreact.dev/) | Deep hooks mastery (paid) |

### Weekly Practice Plan (30 LPA Track)

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | JSX, components, props | Todo app with TypeScript |
| 2 | useState, useEffect, forms | Weather app with API |
| 3 | useContext, useReducer, custom hooks | Theme + auth context |
| 4 | React Router, code splitting | Multi-page dashboard |
| 5 | Performance, memo, virtualization | Optimize 1 Frontend Mentor project |
| 6 | TanStack Query + Zustand | E-commerce product listing |
| 7 | Error boundaries, testing (RTL) | Production-grade MERN frontend module |

### Interview Simulation Exercises

1. Build a debounced search with abort controller and loading states.
2. Implement infinite scroll with Intersection Observer + TanStack Query.
3. Create accessible modal (focus trap, ESC close, `useId`).
4. Explain fiber architecture and concurrent rendering to a mock interviewer.
5. Refactor a class component codebase to hooks (if given legacy code).

### Recommended Reading Order on react.dev

1. Quick Start → Installation  
2. Describing the UI (JSX, components, props)  
3. Adding Interactivity (state, events, forms)  
4. Managing State (lifting, reducer, context)  
5. Escape Hatches (refs, effects, context pitfalls)  
6. Hooks API Reference — read every hook once  

---

**Previous in bootcamp:** [02-typescript-complete.md](./02-typescript-complete.md) — TypeScript fundamentals for React.

**Next:** Node.js & Express — backend layer of MERN stack.
