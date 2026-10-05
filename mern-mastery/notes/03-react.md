# React — Complete Notes

---

## 1. What is React?

- **Library** (not framework) for building UIs
- **Component-based** — reusable UI pieces
- **Virtual DOM** — diffing algorithm for efficient updates
- **Declarative** — describe what UI should look like, React handles how

---

## 2. JSX

```jsx
const element = <h1 className="title">Hello, {name}</h1>;

// Rules:
// - className instead of class
// - htmlFor instead of for
// - Self-closing tags: <img />, <br />
// - One parent element (or Fragment <>...</>)
// - JavaScript expressions in { }
```

---

## 3. Components

### Function components (standard in 2026)

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

// With TypeScript
interface WelcomeProps {
  name: string;
}
function Welcome({ name }: WelcomeProps) {
  return <h1>Hello, {name}</h1>;
}
```

---

## 4. Props & State

```jsx
function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

**Rules:**
- Props flow **down** (parent → child)
- State is **local** unless lifted up or global
- Never mutate state directly — always use setter

---

## 5. useEffect — Side Effects

```jsx
useEffect(() => {
  // Runs after render
  document.title = `Count: ${count}`;

  return () => {
    // Cleanup — runs before next effect or unmount
    document.title = "App";
  };
}, [count]); // dependency array
```

| Dependency array | Behavior |
|------------------|----------|
| `[]` | Run once on mount |
| `[a, b]` | Run when `a` or `b` changes |
| omitted | Run every render (avoid) |

**Common uses:** fetch data, subscriptions, DOM manipulation, timers.

---

## 6. All Essential Hooks

### useState
```jsx
const [user, setUser] = useState(null);
setUser(prev => ({ ...prev, name: "New" })); // functional update
```

### useRef
```jsx
const inputRef = useRef(null);
inputRef.current.focus(); // DOM access
// Also: persist value without re-render
```

### useMemo — memoize expensive computation
```jsx
const sorted = useMemo(() => expensiveSort(items), [items]);
```

### useCallback — memoize function reference
```jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### useContext — avoid prop drilling
```jsx
const ThemeContext = createContext("light");
const theme = useContext(ThemeContext);
```

### Custom hooks
```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

---

## 7. Lists & Keys

```jsx
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}
```

**Key rules:** Use stable unique IDs, never array index for dynamic lists.

---

## 8. Forms

```jsx
// Controlled input
const [email, setEmail] = useState("");
<input value={email} onChange={e => setEmail(e.target.value)} />

// React Hook Form + Zod (production pattern)
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

---

## 9. Performance

```jsx
// React.memo — skip re-render if props unchanged
const MemoCard = React.memo(UserCard);

// Lazy loading
const Dashboard = lazy(() => import("./Dashboard"));
<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

**When to optimize:** Measure first (React DevTools Profiler). Don't premature optimize.

---

## 10. State Management

| Solution | When to use |
|----------|-------------|
| useState + lift state | Small apps |
| useContext | Theme, auth, locale |
| Zustand | Medium apps, simple global state |
| Redux Toolkit | Large apps, complex state, time-travel debugging |

---

## 11. React Router v6

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/users/:id" element={<UserDetail />} />
  <Route path="*" element={<NotFound />} />
</Routes>

const { id } = useParams();
const navigate = useNavigate();
navigate("/dashboard");
```

---

## 12. Interview Topics

- Virtual DOM vs Real DOM
- Reconciliation & diffing
- Why keys matter
- useEffect cleanup
- Controlled vs uncontrolled components
- Error boundaries
- React 18 features: concurrent rendering, Suspense, useTransition
