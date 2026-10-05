#!/usr/bin/env python3
"""
Generator for the Comprehensive 144-Question 3 YOE MERN & MEAN Stack Master Interview Bank.
16 High-Yield, In-Depth Technical Questions per Module across 9 Specialized Tracks.
"""
import os
import sys
from pathlib import Path

OUTPUT_FILE = Path("/Users/reelax/Desktop/test/Full stack development/data/mern-mean-3yoe-interview-bank.md")

content = """# 3 Years Experienced MERN & MEAN Stack Master Interview Bank
## Senior Full-Stack Engineering Bar (Google, Meta, Amazon, Atlassian, Razorpay, Swiggy, Uber)

> **Target Audience:** 3+ Years Experienced Software Development Engineers (SDE-2 / Mid-Senior Full-Stack Engineers).  
> **Evaluation Focus:** Deep internal mechanics, performance trade-offs, concurrency, memory profiling, production debugging, scalable architectural patterns, and live machine coding polyfills.

---

## 📑 Table of Contents
1. [Module 1: React.js (Deep Internals, Fiber, Hooks & Performance)](#module-1-reactjs-deep-internals-fiber-hooks--performance) (Q1 – Q16)
2. [Module 2: Redux & State Management (RTK, RTK Query, Zustand, Context API)](#module-2-redux--state-management-rtk-rtk-query-zustand-context-api) (Q17 – Q32)
3. [Module 3: Angular (MEAN Stack Core: OnPush, Signals, RxJS, DI & Routing)](#module-3-angular-mean-stack-core-onpush-signals-rxjs-di--routing) (Q33 – Q48)
4. [Module 4: Node.js & Express.js (libuv, Streams, Worker Threads, Clustering, Security)](#module-4-nodejs--expressjs-libuv-streams-worker-threads-clustering-security) (Q49 – Q64)
5. [Module 5: MongoDB & Mongoose (Schema Design, ESR Indexing, Aggregation, Transactions)](#module-5-mongodb--mongoose-schema-design-esr-indexing-aggregation-transactions) (Q65 – Q80)
6. [Module 6: SQL & Relational Databases (PostgreSQL / MySQL, ACID, Locks, Indexing)](#module-6-sql--relational-databases-postgresql--mysql-acid-locks-indexing) (Q81 – Q96)
7. [Module 7: API Architecture, GraphQL, Microservices & Security](#module-7-api-architecture-graphql-microservices--security) (Q97 – Q112)
8. [Module 8: Scenario-Based System Design & Low-Level Design (LLD for 3 YOE)](#module-8-scenario-based-system-design--low-level-design-lld-for-3-yoe) (Q113 – Q128)
9. [Module 9: Live Machine Coding & Polyfill Drills](#module-9-live-machine-coding--polyfill-drills) (Q129 – Q144)

---

# Module 1: React.js (Deep Internals, Fiber, Hooks & Performance)

### Question 1: How does React Fiber work under the hood, and how does it enable Concurrent Mode in React 18 & 19?
**Answer:**
**React Fiber** is the complete rewrite of React’s core reconciliation engine introduced to solve the synchronous, uninterruptible nature of the legacy Stack Reconciler.

1. **The Fiber Data Structure:**
   A Fiber is a plain JavaScript object representing a unit of work. Each React element has a corresponding Fiber node forming a mutable tree linked via three pointers:
   - `child`: Points to the first direct child.
   - `sibling`: Points to the immediate next sibling.
   - `return`: Points back to the parent fiber.
   ```text
        [ App Fiber ]
             │ child
        [ Header Fiber ] ─── sibling ───► [ Content Fiber ]
             │ child                              │ child
        [ Nav Fiber ]                        [ Feed Fiber ]
   ```

2. **The Two-Phase Architecture:**
   - **Render / Reconciliation Phase (Asynchronous & Interruptible):** React traverses the Fiber tree using a cooperative scheduling work loop (`workLoopConcurrent`). It computes the diff between current and work-in-progress (WIP) trees. If higher-priority work (like user typing or animation) enters the queue, React can pause, abort, or throw away the WIP tree without mutating the real DOM.
   - **Commit Phase (Synchronous & Uninterruptible):** Once the WIP Fiber tree is finished, React applies all DOM mutations (`Placement`, `Update`, `Deletion`), runs layout effects, and swaps `current` with `workInProgress` (Double Buffering).

3. **Fiber Lanes Priority System (React 18/19):**
   Priorities are represented as 31-bit integer bitmasks called **Lanes**:
   - `SyncLane` (Discrete user actions: Click, KeyPress)
   - `InputContinuousLane` (Scroll, Drag, MouseMove)
   - `DefaultLane` (Data fetching, Redux dispatches)
   - `TransitionLane` (Non-urgent updates wrapped in `startTransition`)
   - `IdleLane` (Offscreen pre-rendering)

4. **Concurrent Features Enabled:**
   - `useTransition()`: Marks state updates as non-blocking, allowing the UI to remain responsive during heavy re-renders.
   - `useDeferredValue()`: Defers recalculations of derived values until urgent renders complete.
   - Automatic Batching: Batches state updates across async timeouts, promises, and native event handlers.

---

### Question 2: Explain the exact lifecycle and execution order of `useInsertionEffect`, `useLayoutEffect`, and `useEffect`. When must you use each?
**Answer:**
Understanding the exact browser rendering lifecycle is critical for eliminating layout thrashing and visual flickers:

```text
React Render Phase (Virtual DOM Diffing)
       │
       ▼
React Commit Phase (DOM Mutated into Real DOM Tree)
       │
       ├──► 1. useInsertionEffect (Runs synchronously BEFORE layout effects & CSS recalculation)
       │       - Used exclusively by CSS-in-JS libraries (Emotion, Styled-Components) to inject <style> tags.
       │
       ├──► 2. useLayoutEffect (Runs synchronously AFTER DOM mutations but BEFORE Browser Paint)
       │       - Blocks browser screen paint.
       │       - Perfect for reading layout (getBoundingClientRect, scroll offsets) and synchronous DOM mutations to prevent visual jitter.
       │
       ▼
Browser Paints Screen to User (Reflow & Repaint Completed)
       │
       ▼
React Post-Paint Phase
       │
       └──► 3. useEffect (Runs asynchronously AFTER Browser Paint)
               - Non-blocking. Ideal for data fetching, subscriptions, timer initialization, and analytics logging.
```

**Interview Trap:** Using `useEffect` to measure an element’s height and immediately adjust child positioning will cause a visible flicker (FOUC) because the browser first paints at the old position, then repaints at the new position. Using `useLayoutEffect` guarantees that the measurement and adjustment happen before the frame is painted to the display.

---

### Question 3: What causes "Stale Closures" in React hooks (`useEffect`, `useCallback`, `useMemo`), and how do you resolve them in production?
**Answer:**
A **Stale Closure** occurs when a callback function or effect captures variables from an older component render cycle and continues to access the outdated values even after component state has changed.

**Root Cause:**
In JavaScript, closures retain references to variables in their lexical environment at creation time. In React, every render is a new function call with its own distinct state constants. If a hook’s dependency array is empty `[]` or omits a variable, the hook retains the function created during render #1:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // BUG: count is forever locked at 0 from render #1!
      console.log('Count is:', count);
      setCount(count + 1); // 0 + 1 => count never exceeds 1!
    }, 1000);
    return () => clearInterval(timer);
  }, []); // Empty deps captures initial render scope only!
}
```

**Production Solutions:**
1. **Functional State Updates:**
   ```javascript
   setCount(prev => prev + 1); // Always reads latest committed state
   ```
2. **`useRef` Bridge Pattern (for event callbacks without re-triggering effects):**
   ```javascript
   function useLatest(value) {
     const ref = useRef(value);
     ref.current = value;
     return ref;
   }
   ```
3. **`useEffectEvent` (Experimental / React RFC):** Separates un-reactive event logic from reactive effect dependencies.

---

### Question 4: How does React Reconciliation diffing algorithm operate in $O(n)$ time complexity? Explain element type comparison and key stability.
**Answer:**
General tree edit distance algorithms (like Levenshtein on trees) have $O(n^3)$ complexity. For a tree with 1,000 nodes, $10^9$ operations would freeze the browser. React achieves $O(n)$ by applying two heuristic assumptions:

1. **Different Element Types Generate Different Trees:**
   - If a `<div>` changes to a `<span>`, or `<Header>` changes to `<Navbar>`, React does not attempt to diff children.
   - It unmounts the old tree (running cleanups and destroying DOM nodes and child state) and mounts the new tree from scratch.

2. **Children Diffing via Keys:**
   - React matches children in the original tree with children in the subsequent tree using unique `key` props.
   - **Without Keys (Index as Key Trap):** If items are inserted at the beginning or reordered, React mutates existing DOM nodes in-place, leading to uncontrolled input state bugs, incorrect animations, and wasted DOM operations.
   - **Stable Keys:** React tracks moved elements by key and performs minimal DOM node moves (`insertBefore`) without rebuilding component subtrees.

```javascript
// BAD: Index as key breaks item identity on deletion/sorting
{items.map((item, index) => <TodoItem key={index} {...item} />)}

// GOOD: Stable database UUID ensures identity preservation
{items.map(item => <TodoItem key={item.id} {...item} />)}
```

---

### Question 5: Compare React Server Components (RSC) vs SSR (Server-Side Rendering) vs CSR (Client-Side Rendering). How does the RSC wire format stream over HTTP?
**Answer:**
| Dimension | Client-Side Rendering (CSR) | Server-Side Rendering (SSR) | React Server Components (RSC) |
| :--- | :--- | :--- | :--- |
| **Execution Environment** | 100% in Browser | Node.js Server + Browser Hydration | Exclusively on Server (Zero Client JS) |
| **Client JS Bundle Size** | Large (All dependencies shipped) | Large (Entire component tree hydrated) | Minimal (Server components stripped from bundle) |
| **Data Access** | Fetch via REST / GraphQL APIs | `getServerSideProps` / Fetch in loaders | Direct DB / File access in component body |
| **State & Interactivity** | `useState`, `useEffect`, Event Handlers | Interactive after hydration completes | No state or browser APIs; renders pure UI tree |
| **Re-rendering Cost** | Re-executes in Browser | Client hydrates and takes over | Re-executes on server; streams JSON-like tree |

**RSC Wire Protocol:**
RSC does not return HTML. It streams a compact JSON-like serialized stream where lines represent component chunks:
```text
M1:{"id":"./src/ClientWidget.js","chunks":["client1"],"name":"default"}
J0:["$","div",null,{"className":"container","children":[["$","h1",null,{"children":"Server Title"}],["$","$L1",null,{"initialCount":42}]]}]
```
- `M`: Modules (Client component references to load on demand).
- `J`: JSON AST representation of the rendered UI tree.
- Client React reconciles this stream into the existing DOM tree without destroying local client state.

---

### Question 6: What strategies and profiling techniques do you use to diagnose and eliminate wasted re-renders in large React applications?
**Answer:**
A component re-render occurs when its state changes, its parent re-renders, or context it subscribes to updates.

**Diagnosis Process:**
1. **React DevTools Profiler:** Record user interactions, check "Record why each component rendered", and identify components taking $>16\text{ms}$ (dropping frames below 60fps).
2. **`why-did-you-render` Library:** Automatically logs in console when a component re-renders despite identical props (`===` reference inequality).

**Remediation Tactics:**
1. **State Collocation:** Move state down to the lowest component that cares about it, avoiding root-level state that forces the whole tree to re-render.
2. **Lifting Content as Children / Props (`Component Composition`):**
   ```javascript
   function ExpensiveContainer({ children }) {
     const [scroll, setScroll] = useState(0);
     return <div onScroll={...}>{children}</div>; // children does NOT re-render on scroll!
   }
   ```
3. **`React.memo` with Custom Equality Comparator:**
   ```javascript
   const MemoizedRow = React.memo(Row, (prev, next) => prev.id === next.id && prev.updatedAt === next.updatedAt);
   ```
4. **Stable Prop References:** Memoize callbacks (`useCallback`) and object/array literals (`useMemo`).

---

### Question 7: How does Automatic Batching work in React 18 & 19, and when would you use `flushSync`?
**Answer:**
In React 17 and earlier, React only batched updates inside React synthetic event handlers (e.g., `onClick`). Updates inside `setTimeout`, `fetch.then()`, or native `addEventListener` triggered separate, synchronous render passes for each `setState`.

**React 18 Automatic Batching:**
All state updates—regardless of whether they originate inside promises, timeouts, or native events—are grouped into a single render pass via the microtask queue:
```javascript
// React 18: Only 1 re-render occurs for both state updates!
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 100);
```

**Emergency Escape Hatch (`flushSync`):**
Forces React to flush all pending updates immediately and synchronously update the DOM:
```javascript
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(count + 1);
  });
  // DOM is guaranteed to be updated synchronously here!
  console.log(domRef.current.textContent);
}
```
*Note:* Use sparingly as `flushSync` degrades performance by de-optimizing the concurrent rendering pipeline.

---

### Question 8: How does `useSyncExternalStore` solve the "Tearing" issue in Concurrent React when subscribing to external stores (Redux, Zustand, browser APIs)?
**Answer:**
**Tearing** is a visual inconsistency where two UI elements rendered during the same frame display different values for the exact same store variable because an asynchronous interrupt occurred midway through rendering and modified the external store.

```text
[Start Render] ──► Component A reads store value = "v1"
      │
[Interrupt: External store updates to "v2"]
      │
[Resume Render] ──► Component B reads store value = "v2"  <-- TEARING BUG!
```

**`useSyncExternalStore` Solution:**
Introduced in React 18 as the official contract for subscribing to external state stores. It guarantees synchronous, consistent reads across the entire concurrent render pass:
```javascript
import { useSyncExternalStore } from 'react';

function useWindowOnlineStatus() {
  return useSyncExternalStore(
    // 1. Subscribe function
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    // 2. Client snapshot function (MUST return cached immutable value)
    () => navigator.onLine,
    // 3. Server snapshot function (SSR initial value)
    () => true
  );
}
```

---

### Question 9: What are the new Action Hooks in React 19 (`useActionState`, `useFormStatus`, `useOptimistic`), and how do they replace manual loading/error state boilerplate?
**Answer:**
React 19 elevates asynchronous functions ("Actions") into first-class primitives for managing form submissions, transitions, and optimistic UI updates:

1. **`useActionState`:** Manages action pending state, return data, and errors automatically:
   ```javascript
   const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
     const updated = await updateProfile(formData);
     return updated;
   }, initialProfile);
   ```

2. **`useFormStatus`:** Child components can inspect their parent `<form>` submission status without prop drilling:
   ```javascript
   function SubmitButton() {
     const { pending } = useFormStatus();
     return <button disabled={pending}>{pending ? 'Saving...' : 'Save Changes'}</button>;
   }
   ```

3. **`useOptimistic`:** Displays instant optimistic updates while the async server mutation completes:
   ```javascript
   const [optimisticMessages, setOptimisticMessages] = useOptimistic(
     messages,
     (current, newMessage) => [...current, { ...newMessage, sending: true }]
   );
   ```

---

### Question 10: How do Error Boundaries work in React? Why can't Error Boundaries catch errors in event handlers or async code, and how do you handle those?
**Answer:**
An **Error Boundary** is a React component that catches JavaScript errors anywhere in its child component tree, logs the errors, and displays a fallback UI instead of crashing the entire component tree.

**Why They Miss Event Handlers & Async Code:**
Error boundaries catch errors during **rendering**, in **lifecycle methods**, and in **constructors** of the tree below them.
- Event handlers execute *outside* the render cycle (triggered by browser events).
- Async code (`setTimeout`, `Promise.reject`) resolves after the render call stack has unwound.

**Capturing Async / Event Handler Errors:**
To propagate an async error into the nearest Error Boundary, update state during rendering or use the `useErrorBoundary` hook from `react-error-boundary`:
```javascript
import { useErrorBoundary } from 'react-error-boundary';

function UserProfile() {
  const { showBoundary } = useErrorBoundary();

  const handleSave = async () => {
    try {
      await saveUserData();
    } catch (err) {
      showBoundary(err); // Re-throws into Error Boundary!
    }
  };
}
```

---

### Question 11: How does the Virtual DOM memory footprint compare against direct DOM update compilation (e.g. Svelte/Solid)? When is Virtual DOM advantageous?
**Answer:**
1. **Virtual DOM Overhead:**
   - Every render creates new JS objects representing the JSX tree (`{ type, props, children }`).
   - Generates garbage collection (GC) pressure when large trees are reconciled frequently.
   - Compares old and new VDOM in JavaScript before touching the real DOM.

2. **Svelte / Solid Direct DOM:**
   - Compiler transforms templates into fine-grained reactive subscriptions (`node.textContent = value`).
   - Zero VDOM diffing overhead; zero runtime GC allocation for VDOM nodes.

3. **Why React Still Uses Virtual DOM:**
   - **Cross-Platform Abstraction:** Fiber enables React Native, React Three Fiber (Three.js), and Terminal renderers (Ink) from the same core mental model.
   - **Concurrent Interruptibility:** VDOM allows React to compute hypothetical future states offscreen across multiple priorities (Lanes) without mutating the actual screen until approved.

---

### Question 12: How does React SyntheticEvent delegation work in React 18/19 vs native DOM events?
**Answer:**
1. **Root Delegation:**
   In React 16, SyntheticEvents were attached to the `document` object. In React 18 & 19, events are attached directly to the root DOM container (`#root` passed to `createRoot`).
   - This prevents conflicts when multiple micro-frontends or React versions coexist on the same HTML page.

2. **Event Pooling Deprecated:**
   In React 16, SyntheticEvent objects were pooled and wiped after the event handler executed (requiring `e.persist()` for async access). In React 17+, pooling was removed completely; `e` is a standard object you can retain asynchronously.

3. **Propagation Order:**
   - Native DOM capture listeners fire first.
   - Native DOM bubble listeners on inner elements fire.
   - React Synthetic event listeners execute at the container level.
   - `e.stopPropagation()` stops React event tree propagation, but does not stop native listeners attached to ancestor DOM elements above the React root container.

---

### Question 13: How do React Portals (`createPortal`) behave regarding DOM hierarchy versus React Fiber event bubbling?
**Answer:**
`ReactDOM.createPortal(children, domNode)` inserts children into a physical DOM node located outside the parent component's DOM tree (e.g., in `document.body` for Modals, Tooltips, Dialogs).

**Critical Mechanical Rule:**
Even though the portal element exists elsewhere in the **HTML DOM tree**, it remains in its original position within the **React Fiber tree**.
- Consequently, React events (e.g. `onClick`, `onKeyDown`) fired inside a portal bubble up through the **React virtual ancestor hierarchy**, NOT the DOM hierarchy.
- A parent component wrapping `<ModalPortal />` can catch clicks originating from inside the portal modal via normal React `onClick` handlers.

---

### Question 14: How do you implement robust Route Code-Splitting with chunk prefetching and automated network failure retry in React SPAs?
**Answer:**
```javascript
import React, { lazy, Suspense } from 'react';

// Resilient Lazy Loader with Exponential Backoff Retry on network failures (e.g. mobile 4G drops)
function resilientLazy(componentImport) {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      componentImport()
        .then(resolve)
        .catch(error => {
          // Retry once after 1.5s on chunk loading failure
          setTimeout(() => {
            componentImport().then(resolve, reject);
          }, 1500);
        });
    });
  });
}

const AnalyticsDashboard = resilientLazy(() => import('./AnalyticsDashboard'));

// Prefetch component chunk on link hover
function NavLink() {
  const prefetch = () => {
    import('./AnalyticsDashboard'); // Triggers browser script preload
  };

  return <a href="/analytics" onMouseEnter={prefetch}>Analytics</a>;
}
```

---

### Question 15: What is the difference between Controlled vs Uncontrolled components, and how do you use `useImperativeHandle` with `forwardRef`?
**Answer:**
- **Controlled:** Form input value is driven entirely by React state (`value={state}` + `onChange={setState}`). Single source of truth in JavaScript memory.
- **Uncontrolled:** Form data is handled by the DOM itself (`defaultValue={val}` + `ref={inputRef}`). Better for extreme high-frequency input (60fps canvas/audio controls) to prevent re-render loops.

**`useImperativeHandle`:**
Customizes the instance value exposed to parent components via `ref`, hiding internal DOM elements and exposing strict public methods:
```javascript
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focusInput: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; }
  }));

  return <input ref={inputRef} {...props} />;
});
```

---

### Question 16: What are the primary causes of Production Memory Leaks in React Single Page Applications, and how do you resolve them?
**Answer:**
1. **Dangling Window / Global Event Listeners:**
   Failing to return cleanup functions in `useEffect`:
   ```javascript
   useEffect(() => {
     const handler = () => { ... };
     window.addEventListener('resize', handler);
     return () => window.removeEventListener('resize', handler); // MANDATORY!
   }, []);
   ```

2. **Un-aborted Fetch Promises Updating Unmounted Components:**
   If a network request resolves after component unmounts, closures keep component references in RAM:
   ```javascript
   useEffect(() => {
     const controller = new AbortController();
     fetch(url, { signal: controller.signal }).then(...);
     return () => controller.abort(); // Cancels active HTTP request!
   }, [url]);
   ```

3. **Retained Closures in Global Singletons / Event Emitters:** Subscribing to RxJS Observables or Node EventEmitters without unsubscribing on component destruction.

---

# Module 2: Redux & State Management (RTK, RTK Query, Zustand, Context API)

### Question 17: How does Redux Toolkit (RTK) use Immer.js under the hood? Explain draft state mutation, proxy traps, and structural sharing.
**Answer:**
Classic Redux required tedious manual object spreading to maintain immutability (`return { ...state, user: { ...state.user, name: 'Alice' } }`), which was error-prone and verbose.

**Immer.js Architecture in RTK:**
1. **Proxy Wrapping:** When a reducer in `createSlice` executes, Immer wraps the current state in a JavaScript `Proxy` called a **Draft State**.
2. **Trap Interception:** When you write `state.user.name = 'Alice'`, the Proxy's `set` trap records an internal list of patch operations rather than mutating the actual state in memory.
3. **Structural Sharing:** Once the reducer completes, Immer produces the next immutable state tree. Unchanged subtrees keep their identical memory references (`===`), while only modified objects are cloned.
4. **Golden Rule:** Either mutate the `draft` state in-place OR return a new state object, never both.

---

### Question 18: How does RTK Query implement Cache Invalidation tags (`providesTags`, `invalidatesTags`) and Optimistic Updates with Rollback?
**Answer:**
RTK Query manages server data caching, deduplication, and automated polling.

**Cache Invalidation Flow:**
- Query endpoints declare which tag types they provide:
  ```javascript
  getPosts: builder.query({
    query: () => '/posts',
    providesTags: (result) => result ? [...result.map(({ id }) => ({ type: 'Posts', id })), { type: 'Posts', id: 'LIST' }] : [{ type: 'Posts', id: 'LIST' }]
  })
  ```
- Mutation endpoints invalidate specific tags:
  ```javascript
  addPost: builder.mutation({
    query: (body) => ({ url: '/posts', method: 'POST', body }),
    invalidatesTags: [{ type: 'Posts', id: 'LIST' }] // Auto-refetches getPosts!
  })
  ```

**Optimistic Updates with Automatic Rollback:**
```javascript
updatePost: builder.mutation({
  query: ({ id, ...patch }) => ({ url: `/posts/${id}`, method: 'PATCH', body: patch }),
  async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
    // 1. Optimistically patch cached post immediately
    const patchResult = dispatch(
      api.util.updateQueryData('getPostById', id, (draft) => {
        Object.assign(draft, patch);
      })
    );
    try {
      await queryFulfilled;
    } catch {
      // 2. Undo patch if server returns 500 / network failure
      patchResult.undo();
    }
  }
})
```

---

### Question 19: What is Normalized State in Redux, and how does `createEntityAdapter` achieve $O(1)$ lookups and efficient updates?
**Answer:**
Storing arrays of nested objects in Redux leads to data duplication, update synchronization bugs, and $O(N)$ array traversal on every update.

**Normalized Shape (`createEntityAdapter`):**
State is normalized into two structures: `ids` (array of IDs) and `entities` (dictionary mapping ID to object):
```javascript
{
  ids: ['p1', 'p2'],
  entities: {
    'p1': { id: 'p1', title: 'Post 1', authorId: 'u1' },
    'p2': { id: 'p2', title: 'Post 2', authorId: 'u2' }
  }
}
```

**Benefits & CRUD Operations:**
- $O(1)$ lookups via `state.entities[id]`.
- Pre-built adapter reducer helpers: `addOne`, `setMany`, `updateOne`, `removeOne`, `upsertMany`.
- Built-in memoized selectors (`selectAll`, `selectById`, `selectIds`, `selectTotal`).

---

### Question 20: Explain the Currying signature of Redux Middlewares (`store => next => action`). How do you build custom logging, analytics, and crash reporting middleware?
**Answer:**
A Redux Middleware sits between `dispatch` and the moment an action reaches the root reducer:

```text
dispatch(action) ──► [ Middleware 1 ] ──► [ Middleware 2 ] ──► Reducers ──► New State
```

**Currying Signature:**
```javascript
const analyticsAndCrashMiddleware = storeAPI => next => action => {
  console.group(`[Redux Action] ${action.type}`);
  console.log('Previous State:', storeAPI.getState());
  console.log('Payload:', action.payload);

  const startTime = performance.now();
  try {
    const result = next(action); // Passes action to next middleware in chain
    const duration = (performance.now() - startTime).toFixed(2);
    console.log('Next State:', storeAPI.getState());
    console.log(`Action took: ${duration}ms`);
    console.groupEnd();
    return result;
  } catch (err) {
    console.error('Unhandled Exception in Redux Pipeline:', err);
    // Send to Sentry / Datadog
    captureException(err, { extra: { action, state: storeAPI.getState() } });
    throw err;
  }
};
```

---

### Question 21: Compare Redux Thunk vs Redux Saga. When do Generator Functions and Saga effects (`takeLatest`, `debounce`, `race`) become necessary?
**Answer:**
| Feature | Redux Thunk | Redux Saga |
| :--- | :--- | :--- |
| **Paradigm** | Functions returning functions (`(dispatch, getState) => ...`) | ES6 Generator Functions (`function*`) |
| **Complexity** | Extremely simple, lightweight, built into RTK | Higher learning curve, requires Generator mental model |
| **Concurrency & Cancellation** | Difficult to cancel in-flight async promises | Built-in task cancellation (`yield cancel(task)`) |
| **Complex Race Conditions** | Requires manual promise bookkeeping | Declarative `takeLatest`, `race`, `throttle`, `debounce` |
| **Testing** | Requires mocking async fetch calls | Pure declarative yield assertions without mocking API |

**Redux Saga Example for Auto-Suggest Search (Cancel Previous Requests):**
```javascript
function* handleSearch(action) {
  yield delay(300); // Debounce
  try {
    const results = yield call(api.searchProducts, action.payload);
    yield put({ type: 'SEARCH_SUCCESS', payload: results });
  } catch (error) {
    yield put({ type: 'SEARCH_FAILED', error });
  }
}

function* watchSearch() {
  // takeLatest automatically cancels any pending handleSearch task if a new SEARCH_REQUEST arrives!
  yield takeLatest('SEARCH_REQUEST', handleSearch);
}
```

---

### Question 22: How does `createSelector` (Reselect) perform memoization? How do you prevent selector cache thrashing with parameterized state?
**Answer:**
`createSelector` takes input selectors, extracts arguments, and executes the output transform function *only* if the input selector values changed by reference (`===`).

**Cache Thrashing Pitfall:**
By default, Reselect has a cache size of **1**. If a single selector instance is called with different props across multiple component instances, the cache is continuously invalidated:
```javascript
// BAD: Shared across 100 TodoItem components => Cache size of 1 is constantly wiped!
const selectTodoById = createSelector(
  [state => state.todos, (state, todoId) => todoId],
  (todos, todoId) => todos.find(t => t.id === todoId)
);
```

**Solution: Factory Function (Unique Selector Per Component Instance):**
```javascript
const makeSelectTodoById = () => createSelector(
  [state => state.todos, (state, todoId) => todoId],
  (todos, todoId) => todos.find(t => t.id === todoId)
);

// Inside Component:
const selectTodo = useMemo(makeSelectTodoById, []);
const todo = useSelector(state => selectTodo(state, props.id));
```

---

### Question 23: Why is React Context API not a State Management tool? Explain the Context Selector problem and contrast with Zustand.
**Answer:**
1. **Context is a Transport Mechanism:** React Context is simply dependency injection to avoid prop drilling. It does not provide state normalization, middleware, devtools, or memoized selector subscriptions.
2. **The Context Selector Problem:** When a Context Provider value updates, **every single component that calls `useContext(MyContext)` is forced to re-render**, even if it only consumes a sub-property that remained unchanged.
3. **Zustand Advantage:** Zustand uses a subscription-based store outside the React tree. Components select exact slices:
   ```javascript
   // Only re-renders if user.name changes!
   const userName = useUserStore(state => state.user.name);
   ```

---

### Question 24: How does Zustand implement transient state updates without triggering React component re-renders?
**Answer:**
Zustand stores allow components to subscribe directly to state mutations without tying the subscription to a React state re-render pass:

```javascript
import create from 'zustand';

const useGameStore = create(set => ({
  score: 0,
  increaseScore: () => set(state => ({ score: state.score + 1 }))
}));

// Transient Update (Direct DOM mutation at 60fps without React re-render):
function ScoreDisplay() {
  const scoreRef = useRef();

  useEffect(() => {
    // Direct store subscription bypasses React reconciliation!
    const unsubscribe = useGameStore.subscribe(
      state => (scoreRef.current.innerText = state.score)
    );
    return unsubscribe;
  }, []);

  return <span ref={scoreRef}>0</span>;
}
```

---

### Question 25: Compare Jotai / Recoil Atomic State vs Centralized Single-Store State (Redux / Zustand).
**Answer:**
- **Atomic State (Jotai / Recoil):** State is broken into minimal independent units called **Atoms**. Components subscribe directly to individual atoms. Derived state is expressed via computed atoms forming an explicit Directed Acyclic Graph (DAG). Ideal for dynamic UI canvases, spreadsheets, and node editors where thousands of small independent nodes exist.
- **Centralized State (Redux / Zustand):** Single state tree with top-down action dispatch and selectors. Ideal for enterprise SaaS apps, relational business objects, and structured CRUD workflows.

---

### Question 26: How do you configure `redux-persist` with migration schemas across mobile/web app versions without bricking client state?
**Answer:**
```javascript
import { createMigrate } from 'redux-persist';

const migrations = {
  // Migration from v0 to v1: rename user.fullName to user.firstName and user.lastName
  1: (state) => ({
    ...state,
    user: {
      firstName: state.user.fullName.split(' ')[0],
      lastName: state.user.fullName.split(' ')[1] || '',
    }
  }),
  // Migration v2: add security settings
  2: (state) => ({
    ...state,
    settings: { ...state.settings, twoFactorEnabled: false }
  })
};

const persistConfig = {
  key: 'root',
  version: 2,
  storage,
  migrate: createMigrate(migrations, { debug: false })
};
```

---

### Question 27: How do you synchronize Redux or client state across multiple browser tabs using `BroadcastChannel`?
**Answer:**
```javascript
const channel = new BroadcastChannel('app_state_sync');

// Redux Middleware to Broadcast and Listen
export const crossTabSyncMiddleware = store => {
  channel.onmessage = (event) => {
    if (event.data && event.data.type === 'SYNC_STATE_FROM_TAB') {
      store.dispatch({ type: 'HYDRATE_CROSS_TAB', payload: event.data.payload });
    }
  };

  return next => action => {
    const result = next(action);
    if (action.meta && action.meta.crossTab) {
      channel.postMessage({
        type: 'SYNC_STATE_FROM_TAB',
        payload: store.getState()
      });
    }
    return result;
  };
};
```

---

### Question 28: How do you implement Dynamic Reducer Injection for Micro-Frontends and lazy-loaded code chunks in Redux?
**Answer:**
```javascript
export function configureDynamicStore(initialReducers = {}) {
  const store = configureStore({
    reducer: createReducer(initialReducers)
  });

  store.asyncReducers = {};

  store.injectReducer = (key, asyncReducer) => {
    if (!store.asyncReducers[key]) {
      store.asyncReducers[key] = asyncReducer;
      store.replaceReducer(createReducer(store.asyncReducers));
    }
  };

  function createReducer(asyncReducers) {
    return combineReducers({
      ...staticReducers,
      ...asyncReducers
    });
  }

  return store;
}
```

---

### Question 29: How do you handle real-time WebSocket streaming updates in RTK Query using `onCacheEntryAdded`?
**Answer:**
```javascript
getLiveFeed: builder.query({
  query: () => '/feed',
  async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
    const ws = new WebSocket('wss://api.example.com/live-feed');
    try {
      await cacheDataLoaded; // Wait for initial fetch to populate cache
      ws.onmessage = (event) => {
        const item = JSON.parse(event.data);
        updateCachedData((draft) => {
          draft.unshift(item); // Prepend real-time stream item
        });
      };
    } catch {}
    await cacheEntryRemoved; // Wait until all components unmount
    ws.close();
  }
})
```

---

### Question 30: How do you unit test async Redux Thunks and integration test components with custom Redux providers?
**Answer:**
```javascript
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

export function renderWithProviders(ui, { preloadedState = {}, store = setupStore(preloadedState), ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Test Case:
test('renders user balance from preloaded state', () => {
  const { getByText } = renderWithProviders(<WalletHeader />, {
    preloadedState: { wallet: { balance: 5000 } }
  });
  expect(getByText('$5,000')).toBeInTheDocument();
});
```

---

### Question 31: How do you profile and eliminate state serialization bottlenecks with Redux DevTools in production?
**Answer:**
- Non-serializable values (Functions, Promises, DOM nodes, Symbols) in actions or state cause severe serialization performance degradations in Redux DevTools and violate time-travel debugging.
- Use `serializableCheck` middleware in RTK to throw warnings in development.
- Disable Redux DevTools in production builds:
  ```javascript
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
  });
  ```

---

### Question 32: Design a Complete Multi-Tier State Architecture: Server State vs Global Client State vs Local State vs URL State.
**Answer:**
1. **Server State (RTK Query / TanStack Query):** Caching, background refetching, deduping, pagination, mutation rollbacks.
2. **Global Client State (Zustand / Redux):** Authenticated user session, theme preferences, shopping cart, multi-step wizards, cross-component UI state.
3. **Local Component State (`useState` / `useReducer`):** Form input validation, open/close dropdown toggles, modal visibility.
4. **URL Query State (`useSearchParams` / `nuqs`):** Search filters, page numbers, sorting order, tab selections (ensures shareable & bookmarkable URLs).

---

# Module 3: Angular (MEAN Stack Core: OnPush, Signals, RxJS, DI & Routing)

### Question 33: How does Angular Change Detection operate under the hood? Contrast `Default` with Zone.js against the `OnPush` strategy.
**Answer:**
1. **Default Strategy (Zone.js):**
   - **Zone.js** monkey-patches all browser async APIs (`setTimeout`, `Promise`, `fetch`, `addEventListener`).
   - Whenever any async event finishes anywhere in the application, Zone.js triggers a top-down dirty check across the entire component tree from `<app-root>` to the deepest leaf node.
   - For an app with 2,000 components, a single mouse click checks all 2,000 components, causing frame drops.

2. **`OnPush` Strategy (`ChangeDetectionStrategy.OnPush`):**
   Angular skips dirty-checking a component and its entire subtree UNLESS one of four conditions occurs:
   - Input reference changes (`@Input()` received a new object reference by `===`).
   - Component or child emits an event (`(click)`, `@Output()`).
   - `AsyncPipe` receives a new value from an Observable.
   - Explicit manual request via `ChangeDetectorRef.markForCheck()`.

---

### Question 34: What are Angular Signals (Angular 16-17+)? How do they achieve fine-grained reactivity and enable Zoneless Angular?
**Answer:**
**Signals** are reactive primitives tracking value producers and consumers in a synchronous Directed Acyclic Graph (DAG):

1. **Core Primitives:**
   - `signal(val)`: Writable signal (`count.set(1)`, `count.update(n => n + 1)`).
   - `computed(() => fn())`: Memoized read-only derived value (lazily evaluated).
   - `effect(() => fn())`: Runs side effects whenever dependencies mutate.

2. **Fine-Grained Updates:**
   - Unlike Zone.js top-down tree sweeps, when a Signal updates, Angular updates **only the exact DOM text node** bound to that signal without running change detection on ancestor components.
   - Enables removing `zone.js` from `angular.json`, drastically reducing bundle size by ~40KB and eliminating reconciliation overhead.

---

### Question 35: Explain the exact differences between RxJS Higher-Order Mapping Operators: `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`.
**Answer:**
```text
Source Observable: ───A───────B────────C───────►

1. switchMap (Cancel previous):
   Cancels in-flight inner observable when a new source value arrives.
   Use Case: Search auto-complete (discard previous search API calls).

2. mergeMap (Concurrent / Parallel):
   Subscribes to all inner observables simultaneously without waiting.
   Use Case: Bulk parallel image uploads or independent fire-and-forget logs.

3. concatMap (Sequential Queue):
   Waits for previous inner observable to complete before starting next.
   Use Case: Financial transactions, order processing where order MUST be preserved.

4. exhaustMap (Ignore incoming until complete):
   Ignores new source values while the current inner observable is running.
   Use Case: Login button clicks, submit buttons to prevent double-submit.
```

---

### Question 36: Compare RxJS Subject types: `Subject`, `BehaviorSubject`, `ReplaySubject`, and `AsyncSubject`.
**Answer:**
- **`Subject`:** Multicast stream with no initial value. Late subscribers receive only values emitted *after* subscription.
- **`BehaviorSubject`:** Requires an initial value. Emits current value immediately to late subscribers on subscription (`.getValue()`).
- **`ReplaySubject(N)`:** Buffers the last $N$ emitted values and replays them to late subscribers.
- **`AsyncSubject`:** Emits only the **last value** and only when the source Observable executes `.complete()`.

---

### Question 37: How does Angular Hierarchical Dependency Injection resolve tokens across Root, Module, and Component injectors?
**Answer:**
Angular's DI system forms a hierarchical tree matching the DOM/Component tree:
1. **Element / Component Injector:** Configured via `@Component({ providers: [...] })`. Instances are scoped to the component lifecycle and its children.
2. **Environment Injector:** Configured via `@Injectable({ providedIn: 'root' })` (App-wide singleton, tree-shakable) or module imports.
3. **Lookup Resolution:** When a component requests `constructor(private auth: AuthService)`, Angular checks its own Element Injector, walks up the DOM hierarchy parent by parent, and finally checks the Root Environment Injector.

---

### Question 38: How do you build an Angular HTTP Interceptor that intercepts 401 Unauthorized errors and seamlessly refreshes JWT tokens?
**Answer:**
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addToken(req)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap(token => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(this.addToken(req));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // Queue requests until refresh finishes
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(this.addToken(req)))
      );
    }
  }

  private addToken(req: HttpRequest<any>) {
    const token = this.authService.getAccessToken();
    return token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  }
}
```

---

### Question 39: How do Angular Route Guards work? Contrast `canActivate`, `canDeactivate`, and `canMatch`.
**Answer:**
- **`canActivate`:** Checks if a user is authorized to navigate to a route.
- **`canDeactivate`:** Checks if a user can leave the current route (e.g. prompting "You have unsaved form changes").
- **`canMatch` (Replaces `canLoad`):** Prevents lazy-loaded module chunks from downloading over the network if conditions fail, saving bandwidth.

---

### Question 40: What are Standalone Components (`standalone: true`) in Angular, and how do they eliminate `NgModule`?
**Answer:**
Introduced in Angular 14-15+ to simplify the component model.
- Components, Directives, and Pipes directly declare their dependencies in the `imports: [CommonModule, ReactiveFormsModule, MyCustomComponent]` array.
- Applications can bootstrap directly with `bootstrapApplication(AppComponent, { providers: [...] })` without creating an `AppModule`.

---

### Question 41: How do you prevent memory leaks from dangling RxJS subscriptions in Angular components?
**Answer:**
1. **`takeUntilDestroyed` Operator (Angular 16+):**
   ```typescript
   private destroyRef = inject(DestroyRef);
   ngOnInit() {
     this.dataService.stream$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(...);
   }
   ```
2. **`AsyncPipe`:** Automatically subscribes and unsubscribes when the component DOM element is destroyed:
   ```html
   <div>{{ data$ | async }}</div>
   ```

---

### Question 42: How do you build Custom Asynchronous Validators with Debouncing in Angular Reactive Forms?
**Answer:**
```typescript
export function uniqueEmailValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    return timer(400).pipe(
      switchMap(() => authService.checkEmailExists(control.value)),
      map(exists => (exists ? { emailTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}
```

---

### Question 43: How does Content Projection work in Angular? Contrast Single-Slot vs Multi-Slot `<ng-content select="...">`.
**Answer:**
- **Single-Slot:** `<ng-content></ng-content>` projects all child elements.
- **Multi-Slot:** Uses CSS selector attributes:
  ```html
  <div class="card-header"><ng-content select="[card-header]"></ng-content></div>
  <div class="card-body"><ng-content select="[card-body]"></ng-content></div>
  ```

---

### Question 44: How do Angular Deferrable Views (`@defer`) optimize initial page load performance?
**Answer:**
Angular 17 `@defer` blocks enable declarative lazy-loading of template subtrees:
```html
@defer (on viewport; prefetch on idle) {
  <heavy-analytics-chart [data]="chartData" />
} @placeholder {
  <div class="skeleton-loader">Loading Chart...</div>
} @error {
  <p>Failed to load chart module.</p>
}
```

---

### Question 45: How does Angular Non-Destructive Hydration work in Server-Side Rendering (SSR)?
**Answer:**
In legacy Angular Universal, SSR rendered HTML on the server, but on client bootstrap the DOM was wiped and re-created from scratch (flickering). In Angular 17+ **Non-Destructive Hydration**, client Angular re-uses the existing server-rendered DOM nodes and attaches event listeners directly.

---

### Question 46: How do you write a Custom Structural Directive in Angular using `TemplateRef` and `ViewContainerRef`?
**Answer:**
```typescript
@Directive({ selector: '[appRoleGuard]', standalone: true })
export class RoleGuardDirective {
  private templateRef = inject(TemplateRef);
  private vcr = inject(ViewContainerRef);
  private authService = inject(AuthService);

  @Input() set appRoleGuard(requiredRole: string) {
    if (this.authService.hasRole(requiredRole)) {
      this.vcr.createEmbeddedView(this.templateRef);
    } else {
      this.vcr.clear();
    }
  }
}
```

---

### Question 47: How do you optimize `@for` loops in Angular templates using track expressions?
**Answer:**
The new `@for` syntax requires mandatory tracking to optimize DOM node reuse:
```html
@for (item of products; track item.id) {
  <product-card [item]="item" />
} @empty {
  <p>No products available.</p>
}
```

---

### Question 48: How do you architect a Production MEAN Stack Application (Angular + Express + MongoDB) with Docker?
**Answer:**
1. **Multi-Stage Dockerfile:**
   - Stage 1: Build Angular SPA into optimized static files (`/dist/browser`).
   - Stage 2: Express Node.js production container serves API endpoints at `/api/*` and serves static Angular files for SPA routes via `express.static`.
2. **Reverse Proxy:** Nginx / Cloudflare handles SSL termination, Brotli compression, and caching headers.

---

# Module 4: Node.js & Express.js (libuv, Streams, Worker Threads, Clustering, Security)

### Question 49: Explain the 6 phases of the libuv Event Loop in detail. Where do `process.nextTick()` and Promises execute?
**Answer:**
Node.js runs on a single thread backed by the **libuv event loop**:

```text
   ┌───────────────────────────┐
┌─►│          Timers           │ ──► setTimeout(), setInterval() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     Pending Callbacks     │ ──► Deferred I/O callbacks (TCP errors, etc.)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │        Idle, Prepare      │ ──► Internal libuv usage only
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           Poll            │ ──► Retrieves new I/O events, executes I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           Check           │ ──► setImmediate() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      Close Callbacks      │ ──► socket.on('close'), cleanup handlers
└─-┴───────────────────────────┘
```

**Microtask Queue Priority (Starvation Hazard):**
Microtasks do NOT execute in the event loop phases; they execute **immediately after every single JavaScript operation completes**, before returning to the event loop.
1. **`process.nextTick` Queue:** Highest priority. Executes before promise microtasks.
2. **Promise Jobs Queue:** Resolves `.then()` / `.catch()` / `await`.

---

### Question 50: What is Stream Backpressure in Node.js, and how do you handle it using `stream.pipeline`?
**Answer:**
**Backpressure** occurs when a `ReadableStream` produces data faster than the `WritableStream` can consume/write it (e.g. reading a 10GB file from SSD and sending it over a slow 3G network socket).
- If unhandled, unwritten chunks accumulate in RAM, leading to Out-Of-Memory (`FATAL ERROR: Ineffective mark-compacts near heap limit`).

```javascript
import { pipeline } from 'stream/promises';
import fs from 'fs';
import zlib from 'zlib';

async function compressAndStream(sourcePath, destinationPath) {
  // pipeline automatically handles backpressure, pauses reader, and cleans up on error!
  await pipeline(
    fs.createReadStream(sourcePath),
    zlib.createGzip(),
    fs.createWriteStream(destinationPath)
  );
  console.log('Compression complete with zero memory bloat.');
}
```

---

### Question 51: Compare Cluster Module vs Worker Threads vs Child Process in Node.js. When do you use each?
**Answer:**
| Feature | Cluster Module (`cluster`) | Worker Threads (`worker_threads`) | Child Process (`spawn`/`exec`/`fork`) |
| :--- | :--- | :--- | :--- |
| **Architecture** | Multiple OS processes sharing one TCP port | Multiple threads in a single process | Independent separate OS processes |
| **Memory** | Isolated memory (100MB+ per worker) | Shared memory (`SharedArrayBuffer`, `MessageChannel`) | Completely isolated memory |
| **Communication** | IPC serialization | Zero-copy `ArrayBuffer` transfer | IPC / stdin / stdout pipes |
| **Primary Use Case** | Scaling Node HTTP servers across multi-core CPUs | CPU-intensive computing (Crypto, Image parsing, ML) | Spawning system binaries (ffmpeg, git, python) |

---

### Question 52: How do you profile and debug Memory Leaks in Node.js production servers using V8 Heap Snapshots?
**Answer:**
1. **Capture Heap Snapshot:** Run node with `--inspect` or use `v8.writeHeapSnapshot()` triggered via HTTP admin endpoint or signal (`SIGUSR2`).
2. **Chrome DevTools Inspection:** Load `.heapsnapshot` file in Chrome DevTools Memory tab.
3. **Comparison View:** Compare Snapshot 1 (baseline) vs Snapshot 2 (after 10,000 requests).
4. **Identify Retainer Trees:** Look for objects with high **Retained Size** (memory held alive by reference) vs **Shallow Size**.
5. **Common Leaks:** Unbounded global caching objects, closures capturing large outer scopes, unremoved event listeners.

---

### Question 53: How do you implement a Graceful Shutdown pattern in Node.js Express applications?
**Answer:**
```javascript
function setupGracefulShutdown(server, dbPool) {
  const shutdown = async (signal) => {
    console.log(`Received ${signal}. Initiating graceful shutdown...`);
    // 1. Stop accepting new HTTP requests
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        // 2. Drain and close database connection pools
        await dbPool.end();
        console.log('Database connections closed cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    });

    // 3. Force exit if shutdown hangs beyond 10 seconds
    setTimeout(() => {
      console.error('Forceful shutdown triggered after timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
```

---

### Question 54: How does Express.js Middleware Onion architecture operate? Explain the 4-argument error handler signature.
**Answer:**
Express processes requests sequentially through a middleware pipeline.
- Calling `next()` delegates to the next middleware.
- Calling `next(new AppError('Unauthorized', 401))` skips all downstream normal middlewares and jumps straight to the **4-argument Error Middleware**:
```javascript
// MUST declare all 4 arguments (err, req, res, next) for Express to identify it as error handler!
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});
```

---

### Question 55: How do you offload CPU-bound tasks (e.g. Scrypt password hashing / image compression) without blocking the libuv thread pool?
**Answer:**
1. **Worker Threads (`worker_threads`):** Spawns dedicated V8 isolates to run heavy CPU computations in parallel.
2. **Tune libuv Thread Pool:** Node's internal thread pool (`UV_THREADPOOL_SIZE`, default 4) handles `crypto.pbkdf2`, `fs`, `dns.lookup`, and `zlib`. For heavy I/O or crypto, increase to CPU cores:
   ```bash
   UV_THREADPOOL_SIZE=16 node server.js
   ```

---

### Question 56: How do you stream large file uploads directly to AWS S3 without buffering in Node.js server RAM?
**Answer:**
```javascript
import busboy from 'busboy';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';

app.post('/upload', (req, res) => {
  const bb = busboy({ headers: req.headers });
  const s3 = new S3Client({ region: 'us-east-1' });

  bb.on('file', (name, fileStream, info) => {
    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: 'my-production-bucket',
        Key: `uploads/${Date.now()}-${info.filename}`,
        Body: fileStream // Streams directly from TCP socket to S3!
      }
    });

    parallelUploads3.done()
      .then(data => res.json({ url: data.Location }))
      .catch(err => res.status(500).json({ error: err.message }));
  });

  req.pipe(bb);
});
```

---

### Question 57: How do you implement Distributed Session Management in Node.js using Redis?
**Answer:**
In multi-instance clustered or autoscaling Node deployments, storing sessions in local process memory (`MemoryStore`) causes session loss when requests hit different instances.
- Use `connect-redis` with `express-session` to store session IDs in Redis with TTL expiration.
- Set strict cookie security: `{ httpOnly: true, secure: true, sameSite: 'strict' }`.

---

### Question 58: How does V8 Garbage Collection operate? Explain Scavenge (Cheney's algorithm) vs Mark-Sweep-Compact.
**Answer:**
- **Young Generation (New Space):** Stores short-lived allocations (1-64MB). Collected via **Scavenge** (fast Cheney copy algorithm dividing space into *From-Space* and *To-Space*).
- **Old Generation (Old Space):** Objects surviving multiple scavenges are promoted. Collected via **Mark-Sweep-Compact** (Marks reachable roots, sweeps dead memory, compacts fragmented pages).

---

### Question 59: How do you secure Express applications against XSS, CSRF, Parameter Pollution, and ReDoS?
**Answer:**
1. **Helmet:** Sets security headers (`Content-Security-Policy`, `HSTS`, `X-Frame-Options`).
2. **HPP (`hpp`):** Prevents HTTP Parameter Pollution (e.g. `?sort=asc&sort=desc`).
3. **Payload Limits:** `express.json({ limit: '10kb' })` prevents memory denial of service attacks.
4. **ReDoS (Regular Expression Denial of Service):** Avoid catastrophic backtracking regexes; use `safe-regex` or `re2`.

---

### Question 60: What causes Memory Leak warnings on Node.js `EventEmitter` (`MaxListenersExceededWarning`), and how do you fix it?
**Answer:**
Node emits `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 listeners added` when more than 10 listeners are attached to a single emitter.
- **Cause:** Adding listeners inside request handlers without removing them on response finish.
- **Fix:** Use `emitter.once()` or pass an `AbortSignal`:
  ```javascript
  emitter.on('event', handler, { signal: abortController.signal });
  ```

---

### Question 61: How do you calculate optimal Database Connection Pool sizing in Node.js?
**Answer:**
Formula based on PostgreSQL / HikariCP benchmarks:
$$\text{Max Pool Size} = (\text{CPU Cores} \times 2) + \text{Effective Spindle / SSD Count}$$
For a 4-core server with SSD storage: $(4 \times 2) + 1 = 9\text{–}10\text{ connections}$.
*Interview Trap:* Setting pool size to 500 causes excessive context switching and database lock contention, degrading throughput.

---

### Question 62: Compare gRPC vs REST vs Message Brokers (Kafka/RabbitMQ) for Node.js Microservices.
**Answer:**
- **REST (JSON over HTTP/1.1):** High compatibility, easy to debug, human readable, higher payload overhead.
- **gRPC (Protobuf over HTTP/2):** Multiplexed, binary compact serialization, 7-10x faster, strictly typed schema contracts. Best for low-latency synchronous inter-service RPC.
- **Kafka / RabbitMQ:** Asynchronous event-driven decoupling, buffer spikes, pub/sub fanout.

---

### Question 63: When and how do you use Node.js C++ / Rust Addons (N-API) for 10x performance improvements?
**Answer:**
Use N-API (Node-API) for heavy numerical computing, video encoding, or custom cryptographic algorithms.
- Guarantees ABI (Application Binary Interface) stability across Node.js major versions without recompilation.

---

### Question 64: How do you implement Distributed Context Tracing in Node.js using `AsyncLocalStorage`?
**Answer:**
```javascript
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

app.use((req, res, next) => {
  const traceId = req.headers['x-trace-id'] || crypto.randomUUID();
  asyncLocalStorage.run(new Map([['traceId', traceId]]), () => {
    next();
  });
});

export function log(message) {
  const store = asyncLocalStorage.getStore();
  const traceId = store ? store.get('traceId') : 'global';
  console.log(`[TraceID: ${traceId}] ${message}`);
}
```

---

# Module 5: MongoDB & Mongoose (Schema Design, ESR Indexing, Aggregation, Transactions)

### Question 65: What is the ESR (Equality, Sort, Range) compound indexing rule in MongoDB, and why does violating it cause in-memory sort crashes?
**Answer:**
The **ESR Rule** dictates the optimal order of fields in a MongoDB compound index:
1. **E - Equality:** Place fields queried with exact matches first (e.g. `{ status: 'ACTIVE' }`).
2. **S - Sort:** Place fields used in `.sort()` second (e.g. `{ createdAt: -1 }`).
3. **R - Range:** Place fields queried with ranges (`$gt`, `$lt`, `$in`) last (e.g. `{ price: { $gte: 100 } }`).

```javascript
// Query:
db.orders.find({ status: 'COMPLETED', amount: { $gte: 500 } }).sort({ orderDate: -1 });

// OPTIMAL INDEX following ESR:
db.orders.createIndex({ status: 1, orderDate: -1, amount: 1 });
```
**Why It Matters:**
If Range precedes Sort (`status_1_amount_1_orderDate_-1`), MongoDB cannot traverse the B-Tree index in sorted order after a range scan. It must pull all documents into RAM and perform an in-memory sort. If the dataset exceeds **100 MB**, the query crashes with `Executor error during find command: Sort exceeded memory limit`.

---

### Question 66: Explain MongoDB Schema Design: Embedding vs Referencing (1:Few, 1:Many, 1:Squillions) and the 16MB BSON Document Limit.
**Answer:**
- **1:Few (Embed):** Array of <100 items (e.g. User Addresses). Embed directly in parent document for single-query retrieval.
- **1:Many (Reference with Array / Parent Reference):** 100–5,000 items (e.g. Product Reviews). Reference via ObjectIds.
- **1:Squillions (Parent Reference):** Millions of rows (e.g. IoT Sensor Logs). Store parent ID in the child document (`{ sensorId: ObjectId('...'), reading: 42.1 }`) to avoid exceeding the **16MB BSON hard limit** and prevent array mutation overhead.

---

### Question 67: Write a Multi-Faceted MongoDB Aggregation Pipeline for E-Commerce Product Filtering with Parallel Counts and Pagination.
**Answer:**
```javascript
db.products.aggregate([
  // 1. Filter matching criteria
  { $match: { category: 'Electronics', price: { $gte: 100, $lte: 2000 } } },
  // 2. Facet splits execution into parallel pipelines
  {
    $facet: {
      // Branch A: Paginated Data
      paginatedResults: [
        { $sort: { rating: -1, price: 1 } },
        { $skip: 20 },
        { $limit: 10 },
        { $project: { name: 1, price: 1, rating: 1, brand: 1 } }
      ],
      // Branch B: Total Matching Count
      totalCount: [
        { $count: 'count' }
      ],
      // Branch C: Brand Breakdown with Counts
      brandFacet: [
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]
    }
  }
]);
```

---

### Question 68: How do Multi-Document ACID Transactions operate in MongoDB? What are the limitations and replica set requirements?
**Answer:**
```javascript
const session = await mongoose.startSession();
session.startTransaction({
  readConcern: { level: 'snapshot' },
  writeConcern: { w: 'majority' }
});

try {
  await Account.updateOne({ _id: fromAccountId }, { $inc: { balance: -amount } }, { session });
  await Account.updateOne({ _id: toAccountId }, { $inc: { balance: amount } }, { session });
  await TransactionAudit.create([{ from: fromAccountId, to: toAccountId, amount }], { session });

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```
- **Requirements:** Minimum 3-node Replica Set.
- **Limitations:** Maximum transaction execution time is 60 seconds (`transactionLifetimeLimitSeconds`). Transactions cannot create collections or indexes on the fly.

---

### Question 69: Compare MongoDB Write Concern (`w: majority`, `j: true`) and Read Concern (`local`, `majority`, `linearizable`, `snapshot`).
**Answer:**
- **`w: 1`:** Acknowledged once primary writes to memory. (Fast, risk of data loss if primary crashes before replication).
- **`w: majority`:** Acknowledged only after written to majority of replica nodes.
- **`j: true`:** Acknowledged only after written to on-disk Journal (guarantees crash recovery).
- **`readConcern: snapshot`:** Provides point-in-time ACID snapshot isolation across multiple collections.

---

### Question 70: How does MongoDB Replication handle Failover Elections and Rollbacks during Network Partitions?
**Answer:**
- Uses a **Raft-like consensus algorithm**.
- When Primary fails to respond to heartbeats within 10 seconds, Secondaries initiate an election.
- The secondary with the most up-to-date `oplog` (highest election priority) is elected Primary.
- **Rollback:** If an un-replicated write occurred on old primary before failure, upon reconnecting as secondary, it writes rolled-back BSON files to disk and syncs to new primary.

---

### Question 71: How do you choose an effective Shard Key in MongoDB? Explain Cardinality, Frequency, and Monotonic hotspotting.
**Answer:**
An ideal Shard Key satisfies:
1. **High Cardinality:** Billions of distinct values (e.g. `uuid`, `customerId`) to prevent mega-chunks that cannot be split.
2. **Low Frequency:** Even write distribution (avoiding keys where 90% of traffic targets a single value like `{ country: 'US' }`).
3. **Non-Monotonic:** Do NOT use auto-incrementing IDs or timestamps as primary shard key, or all writes route to the single shard holding the maximum range boundary (hotspotting). Use **Hashed Sharding** (`{ _id: 'hashed' }`) for uniform write distribution.

---

### Question 72: What are Partial Indexes and TTL (Time-To-Live) Indexes in MongoDB, and where are they used?
**Answer:**
- **Partial Index:** Indexes only documents matching a filter expression. Saves disk RAM and index maintenance:
  ```javascript
  db.users.createIndex({ email: 1 }, { partialFilterExpression: { isActive: true } });
  ```
- **TTL Index:** Automatically deletes documents after a specified number of seconds:
  ```javascript
  db.otps.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 }); // Deletes after 5 minutes!
  ```

---

### Question 73: How does Mongoose `.lean()` bypass document hydration for 5x query speed improvements?
**Answer:**
By default, Mongoose wraps query results in full Mongoose Document instances (with getters, setters, validation, and change tracking).
- `.lean()` returns plain JavaScript objects (POJOs), reducing memory usage by ~80% and query execution time by 5x:
```javascript
const users = await User.find({ role: 'STUDENT' }).lean().select('name email');
```

---

### Question 74: How do MongoDB Change Streams work, and how do you implement real-time event streaming in Node.js?
**Answer:**
```javascript
const orderChangeStream = Order.watch([
  { $match: { 'fullDocument.status': 'PAID' } }
]);

orderChangeStream.on('change', (change) => {
  if (change.operationType === 'insert' || change.operationType === 'update') {
    notifyWarehouseService(change.fullDocument);
  }
});
```

---

### Question 75: How do you analyze `explain("executionStats")` output to identify index misses (`COLLSCAN` vs `IXSCAN`)?
**Answer:**
Key metrics to inspect in `executionStats`:
1. `stage`: `IXSCAN` (Index Scan - Good) vs `COLLSCAN` (Collection Scan - Full table scan - Critical Bug).
2. `totalDocsExamined` vs `nReturned`: In an optimal index, the ratio is 1:1. If `totalDocsExamined` is 100,000 and `nReturned` is 5, index is poorly constructed.
3. `totalKeysExamined`: Number of index keys traversed.

---

### Question 76: Explain the Schema Versioning Pattern in MongoDB for zero-downtime database migrations.
**Answer:**
Instead of running long-running offline migration scripts across 50 million documents:
1. Include `schemaVersion: 2` in new documents.
2. Application reads support both v1 and v2 formats.
3. On write/update, the application upgrades legacy v1 documents to v2 format ("Lazy Migration").

---

### Question 77: What is the Bucket Pattern in MongoDB, and how does it optimize Time-Series / IoT data?
**Answer:**
Instead of storing 1 document per second (86,400 documents/day per device):
Store 1 document per **hour** containing an array of readings:
```javascript
{
  sensorId: 101,
  date: ISODate("2026-09-20T10:00:00Z"),
  count: 3600,
  readings: [{ sec: 0, v: 22.4 }, { sec: 1, v: 22.5 }, ...]
}
```
Reduces index overhead and storage size by >90%.

---

### Question 78: How do you handle Optimistic Locking and Concurrency in MongoDB using Mongoose Version Keys (`__v`)?
**Answer:**
```javascript
const book = await Book.findById(bookId);
book.availableCopies -= 1;

// If another process updated the book in the background, __v differs and save() throws VersionError!
await book.save();
```

---

### Question 79: What are Mongoose Middleware Hooks (`pre`/`post`), and what are the context pitfalls with arrow functions?
**Answer:**
- `pre('save')` for password hashing before database write.
- **Pitfall:** Using arrow functions `(next) => { this.password = ... }` breaks `this` context binding! Always use standard `function()` syntax so `this` references the Mongoose document.

---

### Question 80: How does MongoDB GridFS store files larger than 16MB?
**Answer:**
GridFS divides large binary files into **255KB chunks** stored across two collections:
1. `fs.files`: Contains metadata (filename, uploadDate, contentType, md5, length).
2. `fs.chunks`: Stores binary chunk data with chunk sequence index numbers (`n`).

---

# Module 6: SQL & Relational Databases (PostgreSQL / MySQL, ACID, Locks, Indexing)

### Question 81: Explain the 4 ACID Properties in depth. How do WAL (Write-Ahead Logging) and `fsync` guarantee Durability?
**Answer:**
1. **A - Atomicity:** All SQL statements in a transaction either commit or roll back completely.
2. **C - Consistency:** Transactions transition the database from one valid state satisfying all schemas, unique constraints, and foreign keys to another.
3. **I - Isolation:** Concurrent transactions execute without interfering with one another.
4. **D - Durability:** Once committed, data is permanently persisted even in catastrophic power loss.

**WAL & `fsync` Mechanics:**
Modifying tables directly on disk pages is too slow. Instead, PostgreSQL/MySQL writes a sequential binary log to the **Write-Ahead Log (WAL)** and forces a synchronous disk flush using the OS `fsync()` system call. If the server loses power, on reboot it replays WAL entries from the last checkpoint to recover all committed data.

---

### Question 82: Compare the 4 SQL Transaction Isolation Levels and their Concurrency Phenomena (Dirty Read, Non-Repeatable Read, Phantom Read, Write Skew).
**Answer:**
| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Serialization Anomaly / Write Skew |
| :--- | :---: | :---: | :---: | :---: |
| **Read Uncommitted** | Possible | Possible | Possible | Possible |
| **Read Committed** (Default in Postgres) | Prevented | Possible | Possible | Possible |
| **Repeatable Read** | Prevented | Prevented | Prevented (in Postgres MVCC) | Possible (Write Skew) |
| **Serializable** | Prevented | Prevented | Prevented | Prevented |

- **Dirty Read:** Reading uncommitted data from another transaction that later rolls back.
- **Non-Repeatable Read:** Reading row A, another transaction updates row A, reading row A again yields different values.
- **Phantom Read:** Re-executing a range query (`WHERE age > 30`) returns newly inserted rows.

---

### Question 83: How does Multi-Version Concurrency Control (MVCC) operate in PostgreSQL? Explain `xmin`, `xmax`, Dead Tuples, and `VACUUM`.
**Answer:**
In PostgreSQL, reads never block writes, and writes never block reads.
1. **Tuple Headers:** Every row has hidden metadata columns:
   - `xmin`: Transaction ID that inserted the row.
   - `xmax`: Transaction ID that deleted or updated the row.
2. **Updates as Insert + Delete:** An `UPDATE` does not overwrite the row in place; it sets `xmax` on the old row (creating a **Dead Tuple**) and inserts a new row with a new `xmin`.
3. **`VACUUM` & `AUTOVACUUM`:** Scans tables, frees space occupied by dead tuples whose `xmax` is older than the oldest active transaction, and prevents **Table Bloat**.

---

### Question 84: How do you prevent Race Conditions and the Double-Spending Problem in SQL? Compare Pessimistic Locking (`SELECT FOR UPDATE`) vs Optimistic Locking.
**Answer:**
**1. Pessimistic Locking (`SELECT FOR UPDATE`):**
Acquires an exclusive row-level lock, blocking other transactions until commit:
```sql
BEGIN;
SELECT balance FROM accounts WHERE id = 101 FOR UPDATE;
-- Verify balance >= 100 in application code
UPDATE accounts SET balance = balance - 100 WHERE id = 101;
COMMIT;
```

**2. Atomic Conditional Update (Best Performance for High Concurrency):**
```sql
UPDATE accounts 
SET balance = balance - 100 
WHERE id = 101 AND balance >= 100;
-- Check affected rows: if rows == 0, throw "Insufficient Balance" error!
```

---

### Question 85: How does a B+ Tree Index operate under the hood? Explain Index Seek vs Index Scan vs Covering Index (`INCLUDE`).
**Answer:**
- **B+ Tree:** Balanced search tree where all data rows/pointers reside exclusively in the **Leaf Nodes**, linked as a bidirectional linked list for fast range traversals.
- **Index Seek:** Traverses from Root -> Branch -> Leaf in $O(\log N)$ steps to find an exact key.
- **Index Scan:** Scans leaf node range.
- **Covering Index (`INCLUDE`):**
  ```sql
  CREATE INDEX idx_users_email_include_name ON users(email) INCLUDE (name, status);
  ```
  Appends `name` and `status` to leaf nodes without indexing them. The database answers the query directly from the index (**Index-Only Scan**) without reading the main table heap!

---

### Question 86: How do you interpret PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` Execution Plans?
**Answer:**
Key scan nodes to identify bottlenecks:
- `Seq Scan`: Full table scan on disk.
- `Index Scan`: Reads index, then fetches row from table heap.
- `Index Only Scan`: Reads entirely from index (fastest).
- `Bitmap Heap Scan`: Combines multiple index matches before reading table pages.
- `Buffers: shared hit=42 read=10`: `hit` means read from RAM buffer cache; `read` means physical disk I/O.

---

### Question 87: When should you use GIN (Generalized Inverted Index) and BRIN (Block Range Index) in PostgreSQL?
**Answer:**
- **GIN Index:** Indexes composite items containing sub-elements (JSONB keys/values, Full-Text search lexemes, Arrays). Fast containment queries (`WHERE data @> '{"role": "admin"}'`).
- **BRIN Index:** Extremely compact index for huge append-only tables (e.g. 500 million row audit log ordered by `created_at`). Stores only min/max value per physical disk page range.

---

### Question 88: Compare Database Normalization (1NF, 2NF, 3NF, BCNF) vs Intentional Denormalization.
**Answer:**
- **Normalization:** Eliminates insertion, update, and deletion anomalies by separating concerns into dedicated relational tables.
- **Denormalization:** Intentionally adding duplicate fields (e.g. caching `order_total` or `user_name` directly in `orders` table) to eliminate expensive 5-table `JOIN` operations in high-throughput read paths.

---

### Question 89: How do you query and index PostgreSQL JSONB columns effectively?
**Answer:**
```sql
-- GIN Index on JSONB document:
CREATE INDEX idx_user_metadata_gin ON users USING gin (metadata jsonb_path_ops);

-- Query using JSON containment operator (@>):
SELECT * FROM users WHERE metadata @> '{"tier": "enterprise", "verified": true}';
```

---

### Question 90: How does Declarative Table Partitioning work in PostgreSQL (Range, List, Hash)?
**Answer:**
Splits a massive table into smaller physical partition tables:
```sql
CREATE TABLE measurements (
  sensor_id INT NOT NULL,
  measured_at DATE NOT NULL,
  temperature NUMERIC
) PARTITION BY RANGE (measured_at);

CREATE TABLE measurements_y2026m09 PARTITION OF measurements
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
```
Queries targeting a single month use **Partition Pruning** to scan only that sub-table.

---

### Question 91: Why should you always index Foreign Key columns in Relational Databases?
**Answer:**
While Primary Keys are automatically indexed, **Foreign Keys are NOT automatically indexed**.
- Without an index on `orders(customer_id)`, running `DELETE FROM customers WHERE id = 10` forces the database to acquire a full table-level share lock on `orders` and perform a full table scan to verify referential integrity, causing application-wide lock freezes.

---

### Question 92: Write a Recursive Common Table Expression (CTE) in SQL to query hierarchical tree structures (Org Charts / Nested Comments).
**Answer:**
```sql
WITH RECURSIVE CommentTree AS (
  -- Anchor Member: Root Comments
  SELECT id, parent_id, comment_text, 1 as depth, ARRAY[id] as path
  FROM comments WHERE parent_id IS NULL
  UNION ALL
  -- Recursive Member: Child Comments
  SELECT c.id, c.parent_id, c.comment_text, ct.depth + 1, ct.path || c.id
  FROM comments c
  JOIN CommentTree ct ON c.parent_id = ct.id
)
SELECT * FROM CommentTree ORDER BY path;
```

---

### Question 93: What causes Database Deadlocks, and how do you detect and prevent them?
**Answer:**
**Cause:** Transaction A locks Row 1 and requests Row 2. Simultaneously, Transaction B locks Row 2 and requests Row 1. Neither can proceed.
**Prevention Rule:** Always update and lock resources in a **globally consistent, deterministic order** across the entire codebase (e.g. sorting account IDs before locking: `IDs.sort()`).

---

### Question 94: How does PgBouncer Connection Pooling work? Compare Session vs Transaction vs Statement pooling.
**Answer:**
- **Session Pooling:** Connection allocated for entire client session.
- **Transaction Pooling (Recommended):** Connection assigned only for the duration of a single `BEGIN ... COMMIT` transaction. Enables 10,000 client connections to share 50 backend PostgreSQL connections.
- **Statement Pooling:** Connection released after each SQL statement (does not support multi-statement transactions).

---

### Question 95: How does Database Replication Lag occur in Read Replicas, and how do you achieve "Read-Your-Own-Writes" consistency?
**Answer:**
Asynchronous replication introduces a replication lag window (e.g. 50–500ms). If a user updates their profile and immediately refreshes, the read query might hit a replica that hasn't replayed the write yet.
**Solution:** Pin the user's session to read from the **Primary database** for 2–5 seconds after any write operation.

---

### Question 96: How do you perform Zero-Downtime Database Schema Migrations (Expand and Contract Pattern)?
**Answer:**
1. **Expand:** Add new nullable column `new_column`.
2. **Dual-Write:** Application writes to both `old_column` and `new_column`.
3. **Backfill:** Background batch job migrates historical data.
4. **Contract:** Switch application reads to `new_column`, stop writing to `old_column`, and drop `old_column`.

---

# Module 7: API Architecture, GraphQL, Microservices & Security

### Question 97: Contrast Keyset / Cursor-Based Pagination with Offset Pagination ($O(\log N)$ vs $O(N)$). Why does offset pagination break on live feeds?
**Answer:**
1. **Offset Pagination (`LIMIT 20 OFFSET 100000`):**
   - The database must scan and discard 100,000 rows before returning 20 rows ($O(N)$ execution).
   - **Pagination Drift Bug:** If a new post is inserted while a user is browsing, page 2 repeats the last item from page 1.

2. **Keyset / Cursor Pagination (`WHERE id < 'cursor_uuid' ORDER BY id DESC LIMIT 20`):**
   - Uses B-Tree index seek directly to the cursor row ($O(\log N)$ constant execution time regardless of page depth).
   - Immune to insertion/deletion drift.

---

### Question 98: How does the GraphQL N+1 Problem happen, and how does DataLoader solve it via Batching & Caching?
**Answer:**
**The N+1 Problem:** Querying 50 posts and their authors executes 1 query for posts + 50 individual queries for each author.

**DataLoader Solution:**
Coalesces individual requests made during the same tick of the event loop into a single batch query:
```javascript
const userLoader = new DataLoader(async (userIds) => {
  // Executes SINGLE query: SELECT * FROM users WHERE id IN (1, 2, 3, ...)
  const users = await db.users.find({ id: { $in: userIds } });
  // MUST return array in exact same order and length as userIds!
  return userIds.map(id => users.find(u => u.id === id));
});

// In GraphQL Resolver:
author: (post) => userLoader.load(post.authorId)
```

---

### Question 99: Design a Secure JWT Authentication Flow with Rotating Refresh Tokens and Token Family Replay Detection.
**Answer:**
1. **Short-Lived Access Token (15 min):** Transmitted in `Authorization: Bearer <jwt>` header.
2. **Rotating Refresh Token (7 days):** Stored in `httpOnly`, `Secure`, `SameSite=Strict` cookie.
3. **Token Family Replay Detection:**
   - Each refresh token belongs to a `family_id`.
   - When refreshed, the old refresh token is invalidated, and a new one is issued.
   - If an attacker attempts to reuse an old refresh token, the server detects token theft, invalidates the **entire token family**, and revokes all active sessions for that user.

---

### Question 100: How do you scale WebSockets to 100k+ concurrent connections across multiple Node.js server nodes using Redis Pub/Sub?
**Answer:**
When Node instances scale horizontally behind an Application Load Balancer, User A on Server 1 cannot communicate with User B on Server 2.
**Redis Adapter Architecture:**
- All Node.js Socket.io / WebSocket nodes connect to a centralized Redis instance via **Redis Pub/Sub**.
- When Server 1 emits a message to Room `#engineering`, it publishes the payload to Redis.
- All other Node instances receive the broadcast and push the frame to their local connected client sockets.

---

### Question 101: How do you implement Idempotency in Payment and Order Processing APIs?
**Answer:**
```text
Client Request (Header: Idempotency-Key: <UUID>)
        │
        ▼
API Gateway / Server checks Redis: GET idempotency:<UUID>
        │
        ├──► IF Found & COMPLETED: Return cached response immediately!
        ├──► IF Found & PENDING: Return 409 Conflict ("Transaction in progress")
        │
        └──► IF Not Found:
                1. SET idempotency:<UUID> "PENDING" NX EX 120
                2. Process credit card charge with Stripe
                3. Update Database Order
                4. SET idempotency:<UUID> "{ status: 200, body: {...} }" EX 86400
                5. Return response to client
```

---

### Question 102: Compare API Rate Limiting Algorithms: Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window Log with Redis Lua.
**Answer:**
- **Token Bucket:** Tokens refilled at constant rate; supports bursts up to bucket capacity (AWS, Stripe).
- **Leaky Bucket:** Requests processed at smooth constant rate (traffic shaping).
- **Fixed Window Counter:** Simple counter resetting every minute; vulnerable to 2x traffic bursts at window boundary.
- **Sliding Window Counter (Redis Lua Script):**
  Calculates weighted sum: $\text{Requests} = \text{Count}_{\text{current}} + (\text{Count}_{\text{previous}} \times (1 - \text{timeElapsedPercent}))$. Provides smooth rate limiting with low Redis memory.

---

### Question 103: Compare REST vs GraphQL vs gRPC: Serialization, Transport Protocols, and Use Cases.
**Answer:**
| Dimension | REST | GraphQL | gRPC |
| :--- | :--- | :--- | :--- |
| **Protocol** | HTTP/1.1 or HTTP/2 | HTTP/1.1 or HTTP/2 | HTTP/2 exclusively |
| **Data Format** | JSON / XML (Text) | JSON (Text) | Protocol Buffers (Binary) |
| **Over-fetching** | Common | Zero (Client selects exact fields) | Zero (Binary Protobuf schema) |
| **Streaming** | SSE / Chunked | Subscriptions (WS) | Client, Server & Bi-directional streaming |
| **Best For** | Public APIs, CRUD web apps | Complex frontend dashboards | High-throughput microservice RPC |

---

### Question 104: How do you architect a Production Webhook Ingestion System with HMAC Verification and Dead-Letter Queues (DLQ)?
**Answer:**
1. **Instant Acknowledgment:** Verify `HMAC-SHA256(signature, rawBody, secret)` and immediately return `200 OK` in <50ms.
2. **Async Queue Buffering:** Push webhook payload to RabbitMQ / Kafka / BullMQ.
3. **Worker Processing:** Workers process business logic with exponential backoff retries (3 retries).
4. **Dead-Letter Queue (DLQ):** Poison payloads failing all retries are moved to DLQ for manual inspection and alerting.

---

### Question 105: Contrast XSS (Cross-Site Scripting) vs CSRF (Cross-Site Request Forgery) and their modern mitigation strategies.
**Answer:**
- **XSS:** Attacker injects malicious JavaScript executed in the victim's browser context.
  - *Fix:* Sanitize HTML, avoid `dangerouslySetInnerHTML`, configure strict `Content-Security-Policy (CSP)`.
- **CSRF:** Attacker tricks victim's authenticated browser into sending unauthorized commands to your server.
  - *Fix:* `SameSite=Strict` or `SameSite=Lax` cookies + Anti-CSRF verification tokens for state-changing mutations.

---

### Question 106: Compare Server-Sent Events (SSE) vs WebSockets. When is SSE the superior choice?
**Answer:**
- **SSE:** Unidirectional (Server -> Client), runs over standard HTTP/2, built-in browser automatic reconnection (`EventSource`), works through all firewalls without proxy config.
- **Best For:** AI LLM token streaming (ChatGPT-like interfaces), real-time stock tickers, live notification counters.
- **WebSockets:** Bi-directional full-duplex TCP socket. Required for multiplayer gaming, live chat apps, and collaborative canvas drawing.

---

### Question 107: What is the API Gateway Pattern? Explain Routing, Rate Limiting, and SSL Termination.
**Answer:**
An **API Gateway** acts as the single reverse-proxy entry point for all clients:
- **Centralized Security:** SSL/TLS Termination, CORS handling, JWT validation.
- **Traffic Control:** Rate limiting, DDoS mitigation, circuit breaking.
- **Request Aggregation:** Combines responses from multiple backend microservices into a single frontend response.

---

### Question 108: How do CORS Preflight `OPTIONS` requests work, and how do you cache them with `Access-Control-Max-Age`?
**Answer:**
Browsers send a preflight `OPTIONS` request before non-simple requests (methods other than GET/POST or custom headers like `Authorization`):
```http
OPTIONS /api/v1/orders HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Authorization, Content-Type
```
**Performance Optimization:**
Set `Access-Control-Max-Age: 86400` so the browser caches the preflight permission for 24 hours, eliminating redundant round-trip latencies!

---

### Question 109: Explain OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange).
**Answer:**
1. Client generates random `code_verifier` and computes `code_challenge = SHA256(code_verifier)`.
2. Client redirects user to Auth Server with `code_challenge`.
3. User logs in; Auth Server returns authorization `code`.
4. Client exchanges authorization `code` + original `code_verifier` for Tokens.
5. Auth Server validates `SHA256(code_verifier) === code_challenge`.
*Prevents authorization code interception attacks on Single Page Apps and Mobile Apps.*

---

### Question 110: How do you secure GraphQL APIs against Denial-of-Service attacks?
**Answer:**
1. **Query Depth Limiting:** Rejects nested circular queries beyond depth 5 (`user { posts { author { posts { ... } } } }`).
2. **Query Complexity Analysis:** Assigns cost points per field and rejects queries exceeding cost limits (e.g. max 1,000 points).
3. **Disable Schema Introspection** in production.

---

### Question 111: How does Distributed Tracing propagate trace context using W3C `traceparent` headers?
**Answer:**
Every request is stamped with a W3C standard header:
`traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`
- `version`: `00`
- `trace-id`: Unique identifier for the end-to-end user request across all microservices.
- `parent-id` / `span-id`: Current service segment identifier.
- `trace-flags`: `01` (sample and record trace).

---

### Question 112: Compare Role-Based Access Control (RBAC) vs Attribute-Based Access Control (ABAC).
**Answer:**
- **RBAC:** Permissions assigned strictly to static roles (`ADMIN`, `EDITOR`, `VIEWER`).
- **ABAC:** Permissions evaluated dynamically using attributes of the user, resource, and environment (e.g. *"Allow User to edit Document IF User.department === Document.department AND Time is between 9am-5pm"*).

---

# Module 8: Scenario-Based System Design & Low-Level Design (LLD for 3 YOE)

### Question 113: Design a High-Concurrency Flash Sale / Ticket Booking System preventing inventory overselling.
**Answer:**
**System Architecture & Concurrency Defense:**
```text
Clients ──► Cloudflare CDN ──► Rate Limiter ──► Redis Cluster (Atomic Lua) ──► Kafka ──► DB Worker
```
1. **Redis Atomic Inventory Check (`DECRBY` / Lua):**
   ```lua
   local stock = redis.call('GET', KEYS[1])
   if tonumber(stock) > 0 then
     redis.call('DECR', KEYS[1])
     return 1
   else
     return 0
   end
   ```
2. **Asynchronous Order Creation:** Successful reservations push an event to Kafka. Background consumers write the order into PostgreSQL and process payment within a 5-minute reservation TTL window.

---

### Question 114: How do you prevent Cache Stampede (Dogpiling / Thundering Herd) when a hot cache key expires? Compare Mutex Lock vs XFetch Probabilistic Expiration.
**Answer:**
1. **Distributed Mutex Lock:** Only the first request that experiences a cache miss acquires a lock (`SET lock:key NX EX 5`) and queries the database; other requests wait and read the refreshed cache.
2. **XFetch Algorithm (Probabilistic Early Expiration):**
   Computes: $-\beta \times \delta \times \ln(\text{random}())$ where $\delta$ is computation time. As expiration nears, incoming read requests probabilistically recompute the cache in the background *before* the key actually expires, guaranteeing 0% cache misses for users!

---

### Question 115: Design a Scalable URL Shortener (TinyURL) capable of storing 10 Billion URLs with sub-10ms redirect latency.
**Answer:**
1. **Capacity Estimation:** 10 Billion URLs $\times$ 500 bytes $\approx 5\text{ TB}$ storage. Read-heavy (100:1 read-to-write ratio).
2. **Short Key Generation:** Base62 encoding (`[a-z, A-Z, 0-9]`). $62^7 \approx 3.5\text{ Trillion}$ combinations.
3. **ID Generation:** Distributed Snowflake ID generator guarantees unique 64-bit integer IDs without database coordination.
4. **Caching:** Redis Cache-Aside with LRU eviction stores the top 20% most popular URLs, serving 99% of redirects directly from RAM.

---

### Question 116: Design a Direct-to-S3 Multi-Part File Upload System for Large Videos (1GB+).
**Answer:**
```text
1. Client requests upload: POST /api/v1/uploads/initiate { filename, size }
2. Backend creates S3 Multi-Part Upload, generates signed URLs for each 10MB chunk.
3. Client uploads chunks in parallel directly to AWS S3 via PUT chunk_url.
4. Client notifies Backend: POST /api/v1/uploads/complete { uploadId, parts: [...] }.
5. Backend calls S3 CompleteMultiPartUpload; triggers async transcoding worker.
```
*Zero bandwidth and memory overhead on Node.js application servers.*

---

### Question 117: Design a Resilient Multi-Channel Notification Service (Push, SMS, Email).
**Answer:**
1. **Priority Queues:** Separate RabbitMQ queues for High-Priority (OTP / Fraud alerts) vs Low-Priority (Marketing newsletters).
2. **User Preference Engine:** MongoDB document storing notification channel preferences and DND time windows.
3. **Provider Fallback with Circuit Breakers:** If Twilio SMS returns 500s, circuit breaker opens and falls back to AWS SNS automatically.

---

### Question 118: How does the Circuit Breaker Pattern work in Distributed Microservices? Explain Closed, Open, and Half-Open states.
**Answer:**
```text
    ┌──────────────────────┐
    │        CLOSED        │ ──► All requests pass normally. Track failure rate.
    └──────────┬───────────┘
               │ Failures > 50% threshold
               ▼
    ┌──────────────────────┐
    │         OPEN         │ ──► Fast Fail immediately! Do NOT call downstream service.
    └──────────┬───────────┘
               │ After reset timeout (e.g. 30s)
               ▼
    ┌──────────────────────┐
    │      HALF-OPEN       │ ──► Allow trial requests. If successful -> CLOSED, else -> OPEN.
    └──────────────────────┘
```

---

### Question 119: Solve the Dual-Write Problem using the Transactional Outbox Pattern and Change Data Capture (CDC).
**Answer:**
**The Dual-Write Problem:** Updating PostgreSQL and publishing an event to Kafka in separate operations risks data inconsistency if the server crashes midway.

**Transactional Outbox Solution:**
1. Insert business entity AND an event record into an `outbox` table within the **same local ACID SQL transaction**:
   ```sql
   BEGIN;
   INSERT INTO orders (...) VALUES (...);
   INSERT INTO outbox_events (aggregate_id, event_type, payload) VALUES (...);
   COMMIT;
   ```
2. **Debezium CDC:** Reads PostgreSQL WAL logs and streams outbox events directly into Apache Kafka with guaranteed at-least-once delivery.

---

### Question 120: Compare Operational Transformation (OT) vs Conflict-Free Replicated Data Types (CRDTs) for Real-Time Collaborative Editing.
**Answer:**
- **Operational Transformation (OT - Google Docs):** Relies on a centralized server to linearize and transform concurrent character insertion/deletion operations.
- **CRDTs (Yjs / Automerge - Figma):** Decentralized mathematical data structures where operations are commutative and merge automatically into identical states without central server arbitration.

---

### Question 121: Compare Caching Strategies: Cache-Aside vs Write-Through vs Write-Back (Write-Behind).
**Answer:**
- **Cache-Aside (Lazy Loading):** App reads cache; on miss, reads DB and populates cache. (Most common for web apps).
- **Write-Through:** App writes to cache, and cache synchronously writes to DB before acknowledging.
- **Write-Back (Write-Behind):** App writes to cache immediately; cache asynchronously flushes batch writes to DB (highest write performance, risk of data loss on cache crash).

---

### Question 122: Design an Analytics Clickstream Ingestion Pipeline capable of handling 500,000 events/sec.
**Answer:**
1. **Edge Ingestion:** Lightweight Go / Node.js endpoints behind AWS ALB write raw JSON events directly to **Kafka Topic** partitioned by `user_id`.
2. **Stream Processing:** Apache Flink / Spark consumes Kafka, aggregates 1-minute window metrics.
3. **OLAP Storage:** Stores raw partitioned data in **ClickHouse** or **Apache Pinot** for sub-second analytical SQL queries.

---

### Question 123: Explain Consistent Hashing with Virtual Nodes for Distributed Caching.
**Answer:**
In standard hashing (`hash(key) % N`), adding or removing 1 server re-hashes and invalidates ~100% of cached keys.
**Consistent Hashing:**
- Maps servers and keys onto a circular $2^{32}-1$ hash ring.
- Keys are assigned to the nearest clockwise server node.
- Adding a server migrates only $K/N$ keys ($1/N$th of the cache).
- **Virtual Nodes:** Assigns multiple virtual tokens per physical machine to ensure uniform load distribution.

---

### Question 124: Design an E-Commerce Shopping Cart System supporting Guest Carts and Login Merging.
**Answer:**
1. **Guest Cart:** Stored in Redis with key `cart:guest:<uuid>` with a 7-day TTL.
2. **User Cart:** Stored in Redis with key `cart:user:<user_id>`.
3. **Cart Merge on Login:**
   ```javascript
   async function mergeCarts(guestCartId, userId) {
     const guestItems = await redis.hgetall(`cart:guest:${guestCartId}`);
     for (const [productId, qty] of Object.entries(guestItems)) {
       await redis.hincrby(`cart:user:${userId}`, productId, parseInt(qty));
     }
     await redis.del(`cart:guest:${guestCartId}`);
   }
   ```

---

### Question 125: Design a Proximity / Nearby Driver Search Service (Uber / Yelp) using GeoHashing.
**Answer:**
1. **GeoHash:** Encodes latitude and longitude into a hierarchical base32 string (e.g. `dr5ru`).
2. **Prefix Matching:** Nearby points share common GeoHash prefixes. Searching drivers within a 2km bounding box queries the target GeoHash and its 8 neighboring grid cells.
3. **Storage:** Redis Geospatial index (`GEOADD`, `GEOSEARCH`) or MongoDB `2dsphere` index.

---

### Question 126: How do you architect Database Read/Write Splitting and prevent Replication Lag artifacts?
**Answer:**
- Database router sends all mutations (`INSERT`, `UPDATE`, `DELETE`) to Primary DB and all queries (`SELECT`) to Read Replicas.
- Set a short session cookie `just_modified_until = now() + 3000ms` on mutations. Any read requests arriving while this cookie is present are routed directly to the Primary DB to guarantee Read-Your-Own-Writes consistency.

---

### Question 127: Design an Asynchronous Job Queue System (like BullMQ) using Redis Streams and Sorted Sets (`ZSET`).
**Answer:**
1. **Delayed Jobs:** Added to a Redis Sorted Set (`ZSET`) with Unix timestamp as the score: `ZADD delayed_queue <timestamp> <jobId>`.
2. **Scheduler:** Polls `ZRANGEBYSCORE delayed_queue 0 <now>` and moves ready jobs to the active Redis Stream / List.
3. **Workers:** Execute jobs using atomic `BRPOPLPUSH` / `XREADGROUP` to ensure zero message loss if a worker crashes midway.

---

### Question 128: How do you implement Cross-Microservice Distributed Transactions using the Saga Pattern (Choreography vs Orchestration)?
**Answer:**
- **Choreography:** Services publish and listen to domain events across message brokers without a central coordinator.
- **Orchestration:** A central Saga Orchestrator executes steps sequentially. If Step 3 (Payment) fails, the orchestrator triggers **Compensating Transactions** (e.g. releasing reserved inventory and cancelling delivery) to restore system-wide eventual consistency.

---

# Module 9: Live Machine Coding & Polyfill Drills

### Question 129: Machine Coding: Write a complete Polyfill for `Promise.all` supporting fail-fast behavior and original index order preservation.
**Answer:**
```javascript
function promiseAllPolyfill(promises) {
  return new Promise((resolve, reject) => {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument must be iterable'));
    }
    const items = Array.from(promises);
    if (items.length === 0) return resolve([]);

    const results = new Array(items.length);
    let completed = 0;

    items.forEach((item, index) => {
      // Promise.resolve handles both primitives and actual promises
      Promise.resolve(item).then(
        (val) => {
          results[index] = val; // Preserves original index order!
          completed++;
          if (completed === items.length) {
            resolve(results);
          }
        },
        (err) => {
          reject(err); // Fail-fast on first rejection
        }
      );
    });
  });
}
```

---

### Question 130: Machine Coding: Write a complete Polyfill for `Promise.allSettled`.
**Answer:**
```javascript
function promiseAllSettledPolyfill(promises) {
  return new Promise((resolve, reject) => {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument must be iterable'));
    }
    const items = Array.from(promises);
    if (items.length === 0) return resolve([]);

    const results = new Array(items.length);
    let completed = 0;

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = { status: 'fulfilled', value };
          completed++;
          if (completed === items.length) resolve(results);
        },
        (reason) => {
          results[index] = { status: 'rejected', reason };
          completed++;
          if (completed === items.length) resolve(results);
        }
      );
    });
  });
}
```

---

### Question 131: Machine Coding: Write Polyfills for `Promise.race` and `Promise.any` (with `AggregateError`).
**Answer:**
```javascript
function promiseRacePolyfill(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject);
    }
  });
}

function promiseAnyPolyfill(promises) {
  return new Promise((resolve, reject) => {
    const items = Array.from(promises);
    if (items.length === 0) return reject(new AggregateError([], 'All promises were rejected'));

    const errors = new Array(items.length);
    let rejectedCount = 0;

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        resolve,
        (err) => {
          errors[index] = err;
          rejectedCount++;
          if (rejectedCount === items.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    });
  });
}
```

---

### Question 132: Machine Coding: Implement `promiseRetry(fn, retries, delay, maxDelay)` with Exponential Backoff and Full Jitter.
**Answer:**
```javascript
async function promiseRetry(fn, retries = 3, baseDelay = 100, maxDelay = 3000) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > retries) throw error;

      // Exponential backoff: baseDelay * 2^(attempt - 1)
      const expDelay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt - 1));
      // Full jitter: random between 0 and expDelay
      const jitterDelay = Math.floor(Math.random() * expDelay);

      console.warn(`Attempt ${attempt} failed. Retrying in ${jitterDelay}ms...`);
      await new Promise(res => setTimeout(res, jitterDelay));
    }
  }
}
```

---

### Question 133: Machine Coding: Implement an In-Memory LRU (Least Recently Used) Cache with $O(1)$ `get` and `put` operations.
**Answer:**
```javascript
class DNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new DNode(null, null); // Dummy head
    this.tail = new DNode(null, null); // Dummy tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _add(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._add(node); // Move to head (most recently used)
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._remove(node);
      this._add(node);
    } else {
      if (this.map.size >= this.capacity) {
        // Evict tail (least recently used)
        const lru = this.tail.prev;
        this._remove(lru);
        this.map.delete(lru.key);
      }
      const newNode = new DNode(key, value);
      this._add(newNode);
      this.map.set(key, newNode);
    }
  }
}
```

---

### Question 134: Machine Coding: Write a Production-Grade `debounce(fn, wait, options)` supporting leading, trailing, and `.cancel()`.
**Answer:**
```javascript
function debounce(fn, wait, options = { leading: false, trailing: true }) {
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    const callNow = options.leading && !timerId;

    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (options.trailing && !callNow) {
        fn.apply(lastThis, lastArgs);
      }
    }, wait);

    if (callNow) {
      fn.apply(lastThis, lastArgs);
    }
  }

  debounced.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    lastArgs = lastThis = null;
  };

  return debounced;
}
```

---

### Question 135: Machine Coding: Write a Production-Grade `throttle(fn, wait, options)`.
**Answer:**
```javascript
function throttle(fn, wait, options = { leading: true, trailing: true }) {
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastCallTime = 0;

  return function throttled(...args) {
    const now = Date.now();
    if (!lastCallTime && options.leading === false) {
      lastCallTime = now;
    }
    const remaining = wait - (now - lastCallTime);

    lastArgs = args;
    lastThis = this;

    if (remaining <= 0 || remaining > wait) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      lastCallTime = now;
      fn.apply(lastThis, lastArgs);
    } else if (!timerId && options.trailing !== false) {
      timerId = setTimeout(() => {
        lastCallTime = options.leading === false ? 0 : Date.now();
        timerId = null;
        fn.apply(lastThis, lastArgs);
      }, remaining);
    }
  };
}
```

---

### Question 136: Machine Coding: Write a complete `deepClone(value)` handling Circular References, Dates, RegExps, Maps, and Sets.
**Answer:**
```javascript
function deepClone(value, hash = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (hash.has(value)) return hash.get(value); // Circular reference resolution!

  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const mapCopy = new Map();
    hash.set(value, mapCopy);
    value.forEach((v, k) => mapCopy.set(deepClone(k, hash), deepClone(v, hash)));
    return mapCopy;
  }
  if (value instanceof Set) {
    const setCopy = new Set();
    hash.set(value, setCopy);
    value.forEach(v => setCopy.add(deepClone(v, hash)));
    return setCopy;
  }

  const cloneObj = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  hash.set(value, cloneObj);

  Reflect.ownKeys(value).forEach(key => {
    cloneObj[key] = deepClone(value[key], hash);
  });

  return cloneObj;
}
```

---

### Question 137: Machine Coding: Implement a Custom React Hook `useFetch(url, options)` with In-Memory Caching and `AbortController` cleanup.
**Answer:**
```javascript
import { useState, useEffect, useRef } from 'react';

const globalFetchCache = new Map();

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheKey = url + JSON.stringify(options);

  useEffect(() => {
    if (!url) return;
    if (globalFetchCache.has(cacheKey)) {
      setData(globalFetchCache.get(cacheKey));
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(url, { ...options, signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then(result => {
        globalFetchCache.set(cacheKey, result);
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort(); // Auto-cleanup on unmount / URL change!
  }, [url, cacheKey]);

  return { data, loading, error };
}
```

---

### Question 138: Machine Coding: Implement `useDebounce(value, delay)` and `useThrottle(value, interval)` custom hooks.
**Answer:**
```javascript
import { useState, useEffect, useRef } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle(value, interval) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const elapsed = Date.now() - lastExecuted.current;
    if (elapsed >= interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - elapsed);
      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}
```

---

### Question 139: Machine Coding: Polyfill for `Function.prototype.bind`, `call`, and `apply` without using native methods.
**Answer:**
```javascript
Function.prototype.myCall = function (context = window, ...args) {
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

Function.prototype.myApply = function (context = window, args = []) {
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

Function.prototype.myBind = function (context, ...boundArgs) {
  const targetFn = this;
  return function boundFunction(...callArgs) {
    if (new.target) {
      // If called with 'new' constructor keyword
      return new targetFn(...boundArgs, ...callArgs);
    }
    return targetFn.myApply(context, [...boundArgs, ...callArgs]);
  };
};
```

---

### Question 140: Machine Coding: Implement `flattenObject(obj)` and `unflattenObject(obj)` for deep nested structures.
**Answer:**
```javascript
function flattenObject(obj, prefix = '', result = {}) {
  for (const key of Object.keys(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

function unflattenObject(obj) {
  const result = {};
  for (const key in obj) {
    const keys = key.split('.');
    let current = result;
    keys.forEach((k, idx) => {
      if (idx === keys.length - 1) {
        current[k] = obj[key];
      } else {
        current[k] = current[k] || {};
        current = current[k];
      }
    });
  }
  return result;
}
```

---

### Question 141: Machine Coding: Write a Custom Event Emitter / Pub-Sub Class supporting `on`, `emit`, `off`, and `once`.
**Answer:**
```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(listener);
    return () => this.off(event, listener); // Cleanup helper
  }

  off(event, listener) {
    if (!this.events.has(event)) return;
    const filtered = this.events.get(event).filter(l => l !== listener && l._original !== listener);
    this.events.set(event, filtered);
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    const listeners = [...this.events.get(event)];
    listeners.forEach(l => l.apply(this, args));
    return true;
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };
    onceWrapper._original = listener;
    this.on(event, onceWrapper);
  }
}
```

---

### Question 142: Machine Coding: Implement a Rate-Limited Concurrent Promise Pool (`asyncPool(concurrency, items, asyncFn)`).
**Answer:**
```javascript
async function asyncPool(concurrencyLimit, items, asyncFn) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const p = Promise.resolve().then(() => asyncFn(item));
    results.push(p);
    executing.add(p);

    const clean = () => executing.delete(p);
    p.then(clean, clean);

    if (executing.size >= concurrencyLimit) {
      await Promise.race(executing); // Pause until at least one worker slot frees up!
    }
  }

  return Promise.all(results);
}
```

---

### Question 143: Machine Coding: Implement a Deep Object Equality Comparator (`deepEqual(a, b)`).
**Answer:**
```javascript
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;

  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();

  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Reflect.has(b, key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}
```

---

### Question 144: Machine Coding: Implement an In-Memory Trie (Prefix Tree) for Fast Auto-Complete and Search Suggestions.
**Answer:**
```javascript
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let current = this.root;
    for (const char of word.toLowerCase()) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char);
    }
    current.isEndOfWord = true;
  }

  search(word) {
    let current = this.root;
    for (const char of word.toLowerCase()) {
      if (!current.children.has(char)) return false;
      current = current.children.get(char);
    }
    return current.isEndOfWord;
  }

  getSuggestions(prefix, limit = 5) {
    let current = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!current.children.has(char)) return [];
      current = current.children.get(char);
    }

    const suggestions = [];
    const dfs = (node, path) => {
      if (suggestions.length >= limit) return;
      if (node.isEndOfWord) suggestions.push(prefix + path);
      for (const [char, childNode] of node.children.entries()) {
        dfs(childNode, path + char);
      }
    };

    dfs(current, '');
    return suggestions;
  }
}
```
"""

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(content.strip() + "\n")

print(f"Successfully generated {OUTPUT_FILE} ({os.path.getsize(OUTPUT_FILE)} bytes)")
