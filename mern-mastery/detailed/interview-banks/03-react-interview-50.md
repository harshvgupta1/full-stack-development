# Product Company Interview Bank — React (100 Questions)

> **Target companies:** Google, Meta, Microsoft, Amazon, Adobe, Atlassian, Uber, Flipkart
> **Rule:** Full terms only — spell out JWT as JSON Web Token, API as Application Programming Interface, etc.

---

### Question 1: What is React and why do companies use it?

**Answer:** React is a JavaScript library for building user interfaces, created by Meta (formerly Facebook). Companies use it because it lets teams break the user interface into reusable pieces called components, updates the screen efficiently, and has a huge ecosystem of tools and developers. React works well for single-page applications where the page updates without a full reload, which is common in products at Google, Amazon, and Flipkart.

---

### Question 2: What is JSX and how does it relate to JavaScript?

**Answer:** JSX (JavaScript XML) is a syntax extension that lets you write HTML-like markup inside JavaScript. It is not understood by browsers directly — a tool like Babel converts JSX into regular JavaScript function calls such as `React.createElement`. JSX makes user interface code easier to read because structure and logic live in the same file.

---

### Question 3: What is the Virtual Document Object Model (Virtual DOM)?

**Answer:** The Virtual Document Object Model is a lightweight copy of the real Document Object Model (DOM) kept in memory. When state changes, React builds a new virtual tree, compares it with the previous one (a process called diffing), and updates only the parts of the real DOM that actually changed. This is faster than rewriting the entire page on every update.

---

### Question 4: What is the difference between a component and an element in React?

**Answer:** An element is a plain object that describes what you want to see on the screen — for example, a button with certain text. A component is a function or class that returns elements. Components are reusable: you can use `<Button />` many times with different properties (props) instead of repeating the same element description.

---

### Question 5: What are props in React?

**Answer:** Props (short for properties) are read-only inputs passed from a parent component to a child component. They let you customize how a reusable component behaves or looks. For example, a `<Avatar name="Priya" size="large" />` passes the name and size as props. Props flow one way — from parent to child — which makes data flow predictable.

---

### Question 6: What is state in React?

**Answer:** State is data that belongs to a component and can change over time. When state changes, React re-renders the component to reflect the new data. Examples include whether a modal is open, the text in an input field, or a list of items loaded from an Application Programming Interface (API). State is private to the component that owns it (unless lifted up to a parent).

---

### Question 7: What is the difference between props and state?

**Answer:** Props are passed in from outside and should not be changed by the child. State is owned and managed inside the component. Think of props as function arguments (fixed for that render) and state as local variables that can change. Both trigger a re-render when they change, but only state can be updated by the component itself using a setter function.

---

### Question 8: What is the `useState` hook?

**Answer:** `useState` is a React Hook that adds state to functional components. It returns an array with two items: the current state value and a function to update it. Example: `const [count, setCount] = useState(0)`. When you call `setCount(1)`, React schedules a re-render with the new value. Hooks must be called at the top level of a component, not inside loops or conditions.

---

### Question 9: What is the `useEffect` hook?

**Answer:** `useEffect` runs side effects after React paints the screen. Side effects include fetching data from an API, setting up subscriptions, or manually changing the Document Object Model. You pass a function and optionally a dependency array. If the dependency array is empty `[]`, the effect runs once after the first render (like `componentDidMount`). If you list values like `[userId]`, the effect re-runs when those values change.

---

### Question 10: What is the dependency array in `useEffect`?

**Answer:** The dependency array is the second argument to `useEffect`. It tells React which values the effect depends on. React compares these values between renders; if any changed, the effect runs again. Omitting the array runs the effect after every render. An empty array `[]` runs it only once on mount. Listing `[searchTerm]` re-runs when `searchTerm` changes — useful for refetching search results.

---

### Question 11: How do you clean up effects in `useEffect`?

**Answer:** Return a cleanup function from inside `useEffect`. React calls this cleanup before the effect runs again and when the component unmounts. Common uses: cancel an API request, clear a timer, or remove an event listener. Example: `return () => clearInterval(timerId)`. Forgetting cleanup can cause memory leaks or bugs like updating state on an unmounted component.

---

### Question 12: What is the `useRef` hook?

**Answer:** `useRef` creates a mutable object `{ current: value }` that persists across renders without causing a re-render when it changes. Uses include: holding a reference to a DOM element (`inputRef.current.focus()`), storing a previous value, or keeping a timer ID. Unlike state, updating `ref.current` does not trigger a re-render.

---

### Question 13: What is the `useContext` hook?

**Answer:** `useContext` lets a component read a value from React Context without passing props through every intermediate layer (prop drilling). You create a Context with `React.createContext`, wrap part of the tree in a Provider, and consume the value with `useContext(MyContext)`. Useful for themes, logged-in user info, or language settings shared across many components.

---

### Question 14: What is the `useReducer` hook?

**Answer:** `useReducer` manages complex state with a reducer function `(state, action) => newState`, similar to Redux. It returns `[state, dispatch]`. You call `dispatch({ type: 'increment' })` and the reducer computes the next state. Prefer `useReducer` when state logic is complex, involves multiple sub-values, or the next state depends on the previous one.

---

### Question 15: What are `useMemo` and `useCallback`?

**Answer:** `useMemo` memoizes (caches) the result of an expensive calculation and only recomputes when dependencies change: `useMemo(() => expensive(a, b), [a, b])`. `useCallback` memoizes a function reference: `useCallback(() => doSomething(a), [a])`. Both help performance by avoiding unnecessary work or preventing child components from re-rendering when a new function reference would otherwise break `React.memo` optimization.

---

### Question 16: What is `React.memo`?

**Answer:** `React.memo` is a higher-order component that wraps a functional component and skips re-rendering if props have not changed (shallow comparison). Use it for expensive pure components that receive the same props often. It works best together with stable callback props created via `useCallback`. Do not wrap every component — memoization itself has a small cost.

---

### Question 17: What is lifting state up?

**Answer:** Lifting state up means moving shared state from child components to their closest common parent. The parent owns the state and passes it down as props, along with callback functions for children to request updates. This keeps a single source of truth — for example, two sibling inputs both controlled by one parent `formData` object.

---

### Question 18: What are controlled vs uncontrolled components?

**Answer:** A controlled component gets its value from React state and updates via `onChange` — React is the single source of truth for the input value. An uncontrolled component stores its own value in the DOM; you read it with a ref when needed (e.g., on form submit). Controlled inputs are preferred for validation and instant feedback; uncontrolled can be simpler for one-off forms.

---

### Question 19: What are keys in lists and why do they matter?

**Answer:** When rendering a list with `.map()`, each item needs a unique `key` prop. Keys help React identify which items changed, were added, or removed during reconciliation. Use stable unique identifiers like database IDs, not array indexes (unless the list is static and never reordered). Wrong keys cause bugs like wrong input values sticking to the wrong row.

---

### Question 20: What is reconciliation?

**Answer:** Reconciliation is React's process of comparing the new virtual tree with the previous one and deciding the minimum DOM updates needed. React assumes elements of the same type update in place, and different types tear down the old tree and build a new one. Keys help match list items correctly across renders. Understanding reconciliation explains why you should not mutate state directly.

---

### Question 21: Why should you not mutate state directly?

**Answer:** React compares state by reference to decide whether to re-render. If you mutate an array or object in place (`items.push(newItem)`), the reference stays the same and React may skip the update or behave unpredictably. Always create a new copy: `setItems([...items, newItem])` or `setUser({ ...user, name: 'New' })`. Immutability also makes change detection and debugging easier.

---

### Question 22: What is a custom hook?

**Answer:** A custom hook is a JavaScript function whose name starts with `use` and that calls other hooks inside. It lets you extract and reuse stateful logic across components — for example, `useFetch(url)` or `useLocalStorage(key)`. Custom hooks share logic, not state; each component call gets its own independent state.

---

### Question 23: What are the Rules of Hooks?

**Answer:** (1) Only call hooks at the top level — not inside loops, conditions, or nested functions. (2) Only call hooks from React function components or custom hooks. These rules ensure hooks run in the same order every render so React can match state to the correct hook call. Breaking them causes "Rendered more hooks than during the previous render" errors.

---

### Question 24: What is an Error Boundary?

**Answer:** An Error Boundary is a class component (or library wrapper) that catches JavaScript errors in its child tree during rendering, logs them, and shows a fallback user interface instead of crashing the whole app. Error Boundaries do not catch errors in event handlers, async code, or server-side rendering. React 19 improves error handling with better recovery options.

---

### Question 25: What is code splitting and `React.lazy`?

**Answer:** Code splitting breaks your JavaScript bundle into smaller chunks loaded on demand, reducing initial load time. `React.lazy(() => import('./HeavyComponent'))` loads a component only when it is first rendered. Wrap lazy components in `<Suspense fallback={<Loading />}>` to show a placeholder while the chunk downloads. Common for routes or heavy modals.

---

### Question 26: What is `Suspense` in React?

**Answer:** `Suspense` lets you display a fallback user interface while child components are loading — typically lazy-loaded components or data-fetching integrations. You wrap components in `<Suspense fallback={<Spinner />}>`. Multiple Suspense boundaries can nest for granular loading states. React 19 expands Suspense support for server-side streaming and data fetching.

---

### Question 27: What is the difference between functional and class components?

**Answer:** Class components use `class extends React.Component`, `this.state`, and lifecycle methods like `componentDidMount`. Functional components are plain functions using hooks for state and effects. Since hooks (React 16.8+), functional components are the standard — they are shorter, easier to test, and avoid `this` binding confusion. Class components still appear in older codebases.

---

### Question 28: What were class component lifecycle methods?

**Answer:** Key lifecycle methods: `componentDidMount` (after first render — fetch data), `componentDidUpdate` (after props/state change), `componentWillUnmount` (cleanup before removal). In modern React, `useEffect` replaces these patterns: mount = `useEffect(fn, [])`, update = `useEffect(fn, [deps])`, unmount = return cleanup from `useEffect`. Knowing lifecycle names helps in legacy interviews.

---

### Question 29: What is prop drilling and how do you avoid it?

**Answer:** Prop drilling is passing props through many intermediate components that do not use them, just to reach a deep child. Solutions: React Context (`useContext`), state management libraries (Redux, Zustand), or component composition (pass components as `children` or render props). Choose Context for low-frequency global data; libraries for complex shared state.

---

### Question 30: What is composition in React?

**Answer:** Composition means building complex user interfaces by combining simpler components rather than inheritance. React favors "has-a" over "is-a" — e.g., a `Dialog` accepts `children` for flexible content instead of subclassing `Dialog` for every variant. The `children` prop, render props, and slots patterns all support composition.

---

### Question 31: What is a Higher-Order Component (HOC)?

**Answer:** A Higher-Order Component is a function that takes a component and returns a new component with extra props or behavior — e.g., `withAuth(ProfilePage)` adds authentication checks. HOCs were popular before hooks for reusing logic. Custom hooks often replace HOCs today, but you may still see HOCs in libraries like `connect()` in React-Redux.

---

### Question 32: What is the render props pattern?

**Answer:** Render props is a pattern where a component receives a function as a prop (often called `render` or `children`) and calls it with data: `<DataFetcher render={(data) => <List items={data} />} />`. It shares logic between components. Custom hooks largely supersede render props, but the pattern appears in libraries like React Router and Downshift.

---

### Question 33: What causes unnecessary re-renders and how do you fix them?

**Answer:** Common causes: state changing high in the tree (all children re-render), new object/function references passed as props each render, and Context value changes affecting all consumers. Fixes: split state locally, `React.memo`, `useMemo`/`useCallback`, split Context into smaller contexts, and virtualize long lists. Profile with React DevTools Profiler before optimizing.

---

### Question 34: What is React Strict Mode?

**Answer:** `<StrictMode>` is a development-only wrapper that intentionally double-invokes certain functions (render, effects) to surface side effects and unsafe patterns. It warns about deprecated APIs like legacy string refs. It does not affect production builds. Enable it in development to catch bugs early, especially missing effect cleanups.

---

### Question 35: What is the React Fiber architecture?

**Answer:** Fiber is React's internal reconciliation engine (since React 16). It breaks rendering work into small units that can be paused, prioritized, and resumed — enabling concurrent features. Fiber maintains a linked tree of work units, supports incremental rendering, and powers features like Suspense and transitions. You rarely interact with Fiber directly, but it explains how React stays responsive during heavy updates.

---

### Question 36: What are React Server Components?

**Answer:** React Server Components (RSC) run on the server and send serialized component output to the client — not JavaScript for that component. They can access databases and file systems directly without exposing secrets to the browser. They do not use hooks like `useState` or `useEffect`. Frameworks like Next.js App Router use Server Components by default. Client Components (marked with `'use client'`) handle interactivity.

---

### Question 37: What is new in React 19?

**Answer:** React 19 (2024) introduces: Actions (async transitions for forms and mutations), `useActionState` and `useFormStatus` for form handling, document metadata support (`<title>`, `<meta>` in components), ref as a prop (no more `forwardRef` needed), improved Suspense and hydration error messages, and the React Compiler (optional) that auto-memoizes components. It also deprecates some legacy APIs like `defaultProps` on function components.

---

### Question 38: What are Actions in React 19?

**Answer:** Actions are functions passed to forms or transitions that handle async work (like submitting to a server) with built-in pending states. When you use `<form action={submitAction}>`, React manages loading state and can reset the form on success. Actions integrate with `useTransition` and reduce boilerplate for optimistic updates and error handling in forms.

---

### Question 39: What is `useTransition` in React?

**Answer:** `useTransition` marks state updates as non-urgent transitions. It returns `[isPending, startTransition]`. Wrap slow updates (like filtering a huge list) in `startTransition(() => setFilter(value))` so typing in a search box stays responsive while the heavy re-render happens in the background. Part of React's concurrent rendering model.

---

### Question 40: What is `useDeferredValue`?

**Answer:** `useDeferredValue` delays updating a value until urgent updates finish — similar to debouncing but integrated with React's scheduler. Example: `const deferredQuery = useDeferredValue(query)` — the list filters on `deferredQuery` while the input shows `query` immediately. Useful for keeping input responsive while derived UI catches up.

---

### Question 41: What is hydration in React?

**Answer:** Hydration is when React attaches event listeners and state to server-rendered HTML on the client. The server sends pre-built HTML for fast first paint; client JavaScript "hydrates" it to make it interactive. Hydration mismatches occur when server and client output differ (e.g., using `Date.now()` during render), causing errors. React 19 improves mismatch recovery.

---

### Question 42: What is the React Compiler?

**Answer:** The React Compiler (formerly "React Forget") automatically adds memoization at build time so developers write plain JavaScript without manually adding `useMemo`, `useCallback`, and `React.memo`. It analyzes component purity and optimizes re-renders. It is optional and used at Meta in production; adoption is growing for performance-sensitive apps.

---

### Question 43: How do you handle forms in React?

**Answer:** Options: (1) Controlled components with `useState` per field — full control, good for validation. (2) Uncontrolled with refs — simpler for basic forms. (3) Libraries like React Hook Form or Formik — less boilerplate, built-in validation. (4) React 19 Actions — native async form handling with pending states. Choose based on form complexity and validation needs.

---

### Question 44: How do you fetch data in React?

**Answer:** Common patterns: `useEffect` + `fetch` with loading/error state; data-fetching libraries (TanStack Query, SWR) for caching, refetching, and deduplication; Server Components in Next.js for server-side fetch; React 19 Actions for mutations. Libraries are preferred in client apps because they handle race conditions, caching, and stale data better than raw `useEffect`.

---

### Question 45: What is TanStack Query (React Query) and why use it?

**Answer:** TanStack Query is a data-fetching library that manages server state in React apps. It provides caching, background refetching, pagination, optimistic updates, and deduplication of requests. Instead of storing API data in Redux, you declare queries like `useQuery({ queryKey: ['users'], queryFn: fetchUsers })` and the library handles loading, error, and cache states.

---

### Question 46: What is Redux and when do you still need it?

**Answer:** Redux is a predictable state container for JavaScript apps. It stores global state in a single store, updates via pure reducer functions, and uses actions to describe changes. Use Redux (or Redux Toolkit) when many components share complex client state, you need time-travel debugging, or middleware for logging and async flows. For server state, prefer TanStack Query; for simpler global state, Context or Zustand may suffice.

---

### Question 47: What is React Testing Library?

**Answer:** React Testing Library helps you test components the way users interact with them — by labels, roles, and text — rather than implementation details. Example: `screen.getByRole('button', { name: /submit/i })`. It encourages accessible markup and pairs with Jest or Vitest. Avoid testing internal state; test visible behavior and user flows.

---

### Question 48: What are common React performance patterns?

**Answer:** (1) Virtualize long lists (react-window). (2) Lazy-load routes and heavy components. (3) Memoize expensive calculations and callbacks. (4) Avoid inline object/array literals in props when children are memoized. (5) Split Context to limit re-render scope. (6) Debounce expensive search filters. (7) Use the Profiler to measure before optimizing. Premature optimization wastes time — profile first.

---

### Question 49: What is the difference between React and ReactDOM?

**Answer:** `react` is the core library — components, hooks, state, and reconciliation. `react-dom` is the renderer that updates the browser DOM (`createRoot`, `render`, `hydrateRoot`). Other renderers exist: `react-native` for mobile, `@react-three/fiber` for 3D. In most web interviews, "React" means the core plus `react-dom` together.

---

### Question 50: How would you explain your React project in an interview?

**Answer:** Structure your answer: (1) Problem — what the app does and for whom. (2) Architecture — component structure, state management choice (Context, Redux, TanStack Query), routing. (3) Technical decisions — why Server Components vs Client Components, performance optimizations you applied. (4) Challenges — e.g., fixing re-render issues, handling auth, or improving load time with code splitting. (5) Impact — metrics like faster load, fewer bugs, or better user experience. Use concrete examples from your MERN project.
---

## Questions 51–100 (top product companies)

### Question 51: What is the rules-of-hooks and why do they exist?
**Answer:** Hooks must be top-level and same order every render so React can match state by call index. Conditional hooks break that mapping. Meta / Flipkart.

### Question 52: useMemo vs useCallback vs React.memo — pick one sentence each.
**Answer:** useMemo caches a value. useCallback caches a function identity. memo skips a child re-render if props are shallow-equal. Do not use all three by default. Meta.

### Question 53: How do you fetch data in React 18 without a waterfal?
**Answer:** Lift fetch to a parent or use a cache (React Query). In Next, fetch in Server Components. Avoid useEffect-only fetch on every leaf. Adobe / Meta.

### Question 54: What is a stale closure in useEffect?
**Answer:** The effect captured old state because deps were wrong. Fix deps or use a ref for the latest value. Uber / Meta debugging.

### Question 55: How do you share state between sibling routes?
**Answer:** URL search params, a store, or lift to a layout. Context if slow-changing. Atlassian.

### Question 56: Explain concurrent rendering in one minute.
**Answer:** React can interrupt a render to stay responsive (startTransition). Urgent updates (typing) win over non-urgent (list filter). Meta.

### Question 57: What does startTransition do?
**Answer:** Marks a state update as non-urgent so input stays snappy. Use for big list filters. Meta / Adobe.

### Question 58: How do you test a component that fetches?
**Answer:** Mock fetch / MSW, render, wait for text, assert. RTL `findBy`. Do not test implementation details. Atlassian / Uber.

### Question 59: Why is putting an object in useEffect deps a footgun?
**Answer:** New object identity every render → infinite loop. Depend on primitive fields or memoize. Amazon FE.

### Question 60: How do you avoid layout thrashing in a list?
**Answer:** Virtualize, avoid reading layout then writing in a loop, use CSS for animation. Google FE.

### Question 61: What is lifting state up — when is it too far?
**Answer:** Share state in the nearest common parent. Too far = huge re-renders and prop drilling. Flipkart.

### Question 62: Controlled form libraries vs raw state — when?
**Answer:** Raw for 2–3 fields. RHF/Formik for validation schemas and field arrays. Razorpay / Adobe.

### Question 63: How do you handle optimistic UI?
**Answer:** Update local state first, rollback on error, reconcile with server id. Meta / Uber.

### Question 64: What is the difference between useRef and useState?
**Answer:** Ref changes do not re-render. Use for timers, previous values, DOM nodes. All FE.

### Question 65: How do portals help modals?
**Answer:** Render into document.body to escape overflow/z-index. Still need focus trap and Escape. Atlassian a11y.

### Question 66: Explain React Query staleTime vs cacheTime.
**Answer:** staleTime: how long data is fresh (no refetch). cacheTime/gcTime: how long unused data stays in memory. Uber / Adobe.

### Question 67: How do you prevent XSS in React?
**Answer:** React escapes text children. Danger is `dangerouslySetInnerHTML` and `href={user}`. Sanitize. All.

### Question 68: What is a compound component pattern?
**Answer:** Parent + children that share implicit state (`Select` + `Option`). Used in design systems. Atlassian.

### Question 69: How do you code-split a route?
**Answer:** `lazy` + `Suspense` or Next dynamic import. Show a skeleton. Google / Adobe.

### Question 70: Why did my useEffect run twice in Strict Mode?
**Answer:** React 18 Strict remounts to find unsafe effects. Cleanup must undo the setup. Meta.

### Question 71: How do you type event handlers in TypeScript + React?
**Answer:** `React.ChangeEvent<HTMLInputElement>`, `FormEvent`. Do not use `any`. Atlassian.

### Question 72: What is derived state and why is it a bug source?
**Answer:** Copying props into state and not syncing. Compute during render instead. Flipkart / Meta.

### Question 73: How do you implement tabs accessibly?
**Answer:** roles tablist/tab/tabpanel, arrows, aria-selected, focus management. Atlassian.

### Question 74: Explain the render-props vs hooks history.
**Answer:** Render props and HOCs were reuse patterns; hooks replaced most of them. Still read old codebases. Adobe.

### Question 75: How do you debounce an input in React correctly?
**Answer:** Debounce the callback or the value (useDebounced), not the component function. Abort fetch. Uber.

### Question 76: What is useId for?
**Answer:** Stable unique ids for label/input SSR. Avoid Math.random in render. Next / Adobe.

### Question 77: How do you reset state when a user id changes?
**Answer:** `key={userId}` on the subtree or reset in an effect with that dep. Meta.

### Question 78: What belongs in context vs Redux vs component state?
**Answer:** Local UI → state. App-wide auth/theme → context or store. High-frequency → store with selectors. All senior FE.

### Question 79: How do you profile a slow React page?
**Answer:** React Profiler, why-did-you-render, Chrome performance. Fix the hottest commit. Google FE.

### Question 80: What is an error boundary fallback that is hire-level?
**Answer:** Apologize, retry button, report id, do not blank the whole app. Atlassian.

### Question 81: How do you implement a11y for a custom dropdown?
**Answer:** button trigger, listbox, aria-activedescendant, typeahead optional. Same as autocomplete. Atlassian / Uber.

### Question 82: Why is index as key bad in a sortable list?
**Answer:** State attaches to position, not identity — checkboxes jump. Use ids. All.

### Question 83: How do Server Actions interact with useFormStatus?
**Answer:** Pending state without local useState. Still authenticate on the server. Adobe / Next.

### Question 84: What is hydration mismatch from Date?
**Answer:** Server time ≠ client time. Render a placeholder, set time in useEffect. Next.

### Question 85: How do you keep a WebSocket in React?
**Answer:** One connection in useEffect, cleanup close, reconnect with backoff, put messages in state or a store. Uber / Meta.

### Question 86: Explain memo of a list item vs virtualizing.
**Answer:** Memo helps if parents re-render often. Virtualizing helps if you mount thousands of rows. Different problems. Meta.

### Question 87: How do you handle file upload progress?
**Answer:** XMLHttpRequest or fetch + ReadableStream; progress state; abort. Flipkart / Adobe.

### Question 88: What is the children prop used for composition?
**Answer:** Pass nodes instead of config flags — `Modal` footer as children. Atlassian design system.

### Question 89: How do you prevent a flash of wrong theme?
**Answer:** Read theme before paint (inline script) or class on html from cookie. Adobe / Meta.

### Question 90: What is useSyncExternalStore?
**Answer:** Subscribe to an external store safely with concurrent React. Used by state libraries. Meta-adjacent.

### Question 91: How do you test keyboard-only flows?
**Answer:** userEvent.tab / arrows, assert focus. Required at Atlassian.

### Question 92: When is CSS-in-JS a liability?
**Answer:** Runtime cost, FOUC, harder CSP. CSS modules / Tailwind often enough. Google FE.

### Question 93: How do you implement optimistic list add with rollback?
**Answer:** Temp id, replace on server response, remove on error. Meta.

### Question 94: What is the difference between Link prefetch in Next and React Router?
**Answer:** Next can prefetch the RSC payload on viewport. React Router prefetch is opt-in. Adobe.

### Question 95: How do you avoid waterfalls in useEffect chains?
**Answer:** Fetch in parallel (`Promise.all`) or one endpoint that joins. Amazon FE.

### Question 96: What makes a design-system Button hire-level?
**Answer:** variants, disabled, loading, aria, asChild/slot, no extra wrappers breaking flex. Atlassian.

### Question 97: How do you handle multi-step forms?
**Answer:** Lift step state, persist in URL or session, validate per step. Razorpay / Adobe.

### Question 98: Explain why you should not fetch in the constructor or render.
**Answer:** Side effects belong in effects or server loaders. Render must be pure. All.

### Question 99: How do you cancel React Query requests on key change?
**Answer:** queryKey includes the id; the library aborts/ignores stale. Uber.

### Question 100: Walk through your React project like an interviewer is hostile.
**Answer:** Problem, users, metric, component tree, hardest bug, what you would rewrite. Phase 8A. All companies.
