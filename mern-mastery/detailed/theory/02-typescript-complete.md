# TypeScript — Complete Guide (30 LPA MERN Bootcamp)

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 7 Sep 2026 – 13 Sep 2026 (Days 22–28)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Target level:** Senior frontend / full-stack interviews at product companies (Adobe, Salesforce, Razorpay, Flipkart, Google-adjacent roles). TypeScript is non-negotiable at 30 LPA — you must explain types, generics, and trade-offs fluently.

---

## Table of Contents

1. [Why TypeScript at 30 LPA](#1-why-typescript-at-30-lpa)
2. [Setup & Toolchain](#2-setup--toolchain)
3. [All Core Types](#3-all-core-types)
4. [Interfaces vs Types](#4-interfaces-vs-types)
5. [Functions & Overloads](#5-functions--overloads)
6. [Generics — Deep Dive](#6-generics--deep-dive)
7. [Utility Types](#7-utility-types)
8. [Enums & Literal Types](#8-enums--literal-types)
9. [Type Guards & Narrowing](#9-type-guards--narrowing)
10. [tsconfig.json — Production Config](#10-tsconfigjson--production-config)
11. [Modules & Namespaces](#11-modules--namespaces)
12. [React + TypeScript Patterns](#12-react--typescript-patterns)
13. [Advanced Patterns for Interviews](#13-advanced-patterns-for-interviews)
14. [15 Interview Q&A](#14-15-interview-qa)
15. [Where to Practice](#15-where-to-practice)

---

## 1. Why TypeScript at 30 LPA

| Benefit | Impact in interviews & production |
|---------|-----------------------------------|
| Compile-time safety | Catch null/undefined, wrong props, API shape mismatches before deploy |
| IDE intelligence | Jump-to-definition, rename symbol, inline docs — faster refactors |
| Self-documenting APIs | Function signatures replace tribal knowledge |
| Scale on teams | 50+ engineers touching same codebase without silent breakage |
| Ecosystem standard | React 18+, Next.js, NestJS, tRPC, Prisma all assume TS fluency |

TypeScript is a **structural type system** — compatibility is based on shape, not explicit inheritance (duck typing with verification).

```typescript
// JavaScript runtime — identical output after tsc
const greet = (name: string): string => `Hello, ${name}`;
```

---

## 2. Setup & Toolchain

### 2.1 Quick Start

```bash
# Global CLI (optional — prefer local devDependency)
npm install -D typescript @types/node

# Initialize config
npx tsc --init

# Compile once
npx tsc

# Watch mode
npx tsc --watch
```

### 2.2 Project Structure (MERN / React)

```
src/
  components/
  hooks/
  types/
    api.ts          # shared API response types
    user.ts
  utils/
  index.tsx
tsconfig.json
tsconfig.node.json   # Vite/Next split configs
```

### 2.3 Tooling Stack

| Tool | Purpose |
|------|---------|
| `typescript` | Compiler (`tsc`) |
| `@types/react`, `@types/node` | Ambient type definitions for JS libraries |
| `tsx` / `ts-node` | Run TS without pre-build (scripts) |
| `eslint` + `@typescript-eslint` | Lint rules aligned with TS |
| `vite` / `next` | Bundler with built-in TS transpilation (no emit) |

> **Interview Box:** *"Does TypeScript run in the browser?"*  
> **Answer:** No. `tsc` (or esbuild/swc via bundler) strips types and emits JavaScript. Types exist only at compile time — zero runtime cost unless you use features that emit code (enums, decorators with certain configs).

---

## 3. All Core Types

### 3.1 Primitives

```typescript
let username: string = "priya";
let age: number = 28;
let isVerified: boolean = true;
let nothing: null = null;
let notAssigned: undefined = undefined;
let id: bigint = 9007199254740991n;
let flag: symbol = Symbol("id");
```

### 3.2 Arrays, Tuples, Readonly

```typescript
const nums: number[] = [1, 2, 3];
const tags: Array<string> = ["ts", "react"]; // equivalent syntax

// Tuple — fixed length + typed positions
type Point = [number, number];
const origin: Point = [0, 0];

// Readonly arrays
const frozen: readonly number[] = [1, 2, 3];
// frozen.push(4); // Error
```

### 3.3 Object Types

```typescript
type User = {
  id: string;
  email: string;
  role?: "admin" | "user";   // optional
  readonly createdAt: Date;  // cannot reassign after init
};

const u: User = {
  id: "1",
  email: "a@b.com",
  createdAt: new Date(),
};
```

### 3.4 any, unknown, never, void

| Type | Meaning | When to use |
|------|---------|-------------|
| `any` | Opt out of checking | Legacy migration only — avoid |
| `unknown` | Safe top type — must narrow | External JSON, user input |
| `void` | Function returns undefined | Event handlers, side effects |
| `never` | No possible value | Exhaustive checks, throw helpers |

```typescript
function parseJSON(raw: string): unknown {
  return JSON.parse(raw);
}

function assertNever(x: never): never {
  throw new Error(`Unexpected: ${x}`);
}

function log(msg: string): void {
  console.log(msg);
}
```

### 3.5 Union & Intersection

```typescript
type ID = string | number;

type Employee = { name: string; dept: string };
type Contact = { email: string; phone: string };
type EmployeeContact = Employee & Contact;

// Discriminated union — pattern for API results
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string; code: number };

function handle<T>(res: ApiResponse<T>) {
  if (res.status === "success") {
    console.log(res.data); // narrowed
  } else {
    console.error(res.code, res.message);
  }
}
```

### 3.6 Index Signatures & Record

```typescript
type StringMap = { [key: string]: string };

type Role = "admin" | "editor" | "viewer";
type Permissions = Record<Role, boolean>;

const perms: Permissions = {
  admin: true,
  editor: true,
  viewer: false,
};
```

---

## 4. Interfaces vs Types

### 4.1 Side-by-Side

```typescript
interface IUser {
  id: number;
  name: string;
}

type TUser = {
  id: number;
  name: string;
};
```

### 4.2 Decision Matrix

| Feature | `interface` | `type` |
|---------|-------------|--------|
| Object shapes | ✅ Preferred | ✅ Works |
| Extend / implements | ✅ `extends` | ✅ `&` intersection |
| Declaration merging | ✅ Yes | ❌ No |
| Unions / tuples | ❌ No | ✅ Yes |
| Mapped / conditional types | ❌ No | ✅ Yes |
| Primitives aliases | ❌ No | ✅ `type ID = string` |

```typescript
// Declaration merging — only interfaces
interface Window {
  myCustomProp: string;
}
interface Window {
  anotherProp: number;
}
// Window now has both

// Union — types only
type Result = Success | Failure;
```

### 4.3 Official Guidance (2024+)

- Default to **`interface` for public object shapes** (React props, API models).
- Use **`type` for unions, tuples, utility compositions**.

> **Interview Box:** *"Can you extend a type alias?"*  
> **Answer:** You intersect with `&`, not `extends`. `type B = A & { extra: string }`. Interfaces use `extends` and merge when declared twice with the same name.

---

## 5. Functions & Overloads

```typescript
// Basic
function add(a: number, b: number): number {
  return a + b;
}

// Optional & default params
function greet(name: string, greeting = "Hello"): string {
  return `${greeting}, ${name}`;
}

// Rest params
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

// Function overloads — multiple call signatures, one implementation
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}

// Generic function
function identity<T>(arg: T): T {
  return arg;
}
```

### Callback Typing

```typescript
type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

type Fetcher<T> = (url: string) => Promise<T>;
```

---

## 6. Generics — Deep Dive

Generics parameterize types — write reusable, type-safe abstractions.

### 6.1 Generic Functions & Constraints

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Constraint — T must have length
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

// keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### 6.2 Generic Interfaces & Classes

```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}

class InMemoryRepo<T extends { id: string }> implements Repository<T> {
  private store = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.store.get(id) ?? null;
  }

  async save(entity: T): Promise<T> {
    this.store.set(entity.id, entity);
    return entity;
  }
}
```

### 6.3 Generic Defaults

```typescript
type ApiResult<T = unknown> = {
  data: T;
  timestamp: number;
};

type Paginated<T, PageSize extends number = 20> = {
  items: T[];
  pageSize: PageSize;
  total: number;
};
```

### 6.4 infer Keyword (Conditional Types)

```typescript
type ReturnTypeOf<T> = T extends (...args: unknown[]) => infer R ? R : never;

type FetchUser = () => Promise<{ id: string }>;
type UserPromise = ReturnTypeOf<FetchUser>; // Promise<{ id: string }>
```

> **Interview Box:** *"Why not use `any` instead of generics?"*  
> **Answer:** Generics preserve the relationship between input and output types. `identity<any>(x)` loses type info; `identity<string>("hi")` returns `string`. Critical for hooks like `useState<T>` and API clients.

---

## 7. Utility Types

Built-in helpers in `lib.es5.d.ts` — know these cold for interviews.

### 7.1 Common Utilities

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Partial — all optional (PATCH payloads)
type UserUpdate = Partial<User>;

// Required — opposite
type RequiredUser = Required<User>;

// Pick & Omit
type PublicUser = Pick<User, "id" | "name">;
type SafeUser = Omit<User, "password">;

// Readonly
type FrozenUser = Readonly<User>;

// Record
type UserMap = Record<string, User>;
```

### 7.2 ReturnType, Parameters, Awaited

```typescript
async function fetchUser(id: string) {
  return { id, name: "Amit" };
}

type FetchUserReturn = Awaited<ReturnType<typeof fetchUser>>;
// { id: string; name: string }

type FetchUserParams = Parameters<typeof fetchUser>; // [id: string]
```

### 7.3 Exclude, Extract, NonNullable

```typescript
type T1 = Exclude<"a" | "b" | "c", "a">;       // "b" | "c"
type T2 = Extract<"a" | "b" | 1, string>;     // "a" | "b"
type T3 = NonNullable<string | null | undefined>; // string
```

### 7.4 Custom Mapped Types

```typescript
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Template literal keys
type EventNames = "click" | "focus";
type Handlers = {
  [K in EventNames as `on${Capitalize<K>}`]: () => void;
};
// { onClick: () => void; onFocus: () => void }
```

### Utility Type Cheat Sheet

| Utility | Transforms |
|---------|------------|
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties readonly |
| `Pick<T, K>` | Subset of keys |
| `Omit<T, K>` | Remove keys |
| `Record<K, V>` | Object type from keys → values |
| `Exclude<T, U>` | Remove from union |
| `Extract<T, U>` | Keep matching union members |
| `NonNullable<T>` | Remove null/undefined |
| `ReturnType<F>` | Function return type |
| `Parameters<F>` | Function param tuple |
| `Awaited<T>` | Unwrap Promise |

---

## 8. Enums & Literal Types

### 8.1 String Literal Unions (Preferred in Modern TS)

```typescript
type Status = "idle" | "loading" | "success" | "error";

function setStatus(s: Status) {
  /* ... */
}
```

### 8.2 const Object Pattern

```typescript
const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES]; // "admin" | "user"
```

### 8.3 Enums (Know trade-offs)

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

const enum Compression {
  None,
  Gzip,
} // Inlined at compile time — no runtime object
```

| Approach | Runtime cost | Reverse mapping | Recommendation |
|----------|--------------|-----------------|----------------|
| String union | None | N/A | ✅ Default choice |
| `as const` object | Minimal | N/A | ✅ Config/constants |
| `enum` | Yes (object) | Numeric only | Use when team standard |
| `const enum` | Inlined | Numeric only | Bundler-dependent |

---

## 9. Type Guards & Narrowing

### 9.1 typeof & instanceof

```typescript
function padLeft(value: string | number): string {
  if (typeof value === "number") {
    return " ".repeat(value);
  }
  return value.padStart(10);
}

if (error instanceof Error) {
  console.log(error.message);
}
```

### 9.2 Truthiness & Equality Narrowing

```typescript
function print(str: string | null | undefined) {
  if (str) {
    console.log(str.toUpperCase()); // string
  }
}
```

### 9.3 in Operator

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

### 9.4 User-Defined Type Guards

```typescript
interface Admin {
  role: "admin";
  permissions: string[];
}

interface Member {
  role: "member";
}

type Person = Admin | Member;

function isAdmin(p: Person): p is Admin {
  return p.role === "admin";
}

function authorize(p: Person) {
  if (isAdmin(p)) {
    return p.permissions.includes("write");
  }
  return false;
}
```

### 9.5 Discriminated Unions + Exhaustiveness

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rect":
      return shape.width * shape.height;
    default:
      return assertNever(shape);
  }
}
```

### 9.6 Assertion Functions

```typescript
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== "string") {
    throw new Error("Not a string");
  }
}
```

---

## 10. tsconfig.json — Production Config

### 10.1 Strict MERN / React Baseline

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 10.2 Key Flags Explained

| Flag | Effect |
|------|--------|
| `strict` | Enables `strictNullChecks`, `noImplicitAny`, etc. |
| `noUncheckedIndexedAccess` | `arr[i]` is `T \| undefined` |
| `exactOptionalPropertyTypes` | `{ x?: string }` can't assign `undefined` explicitly |
| `moduleResolution: bundler` | Vite/Next — allows `import` without extension |
| `isolatedModules` | Each file transpilable alone (required for SWC/esbuild) |

> **Interview Box:** *"What's the difference between `moduleResolution: node` and `bundler`?"*  
> **Answer:** `node` follows Node10/Node16 resolution for published packages. `bundler` assumes a modern bundler handles resolution — supports `package.json` `"exports"`, extensionless imports, and aligns with Vite/Next/esbuild workflows.

---

## 11. Modules & Namespaces

### 11.1 ES Modules (Standard)

```typescript
// user.ts
export interface User { id: string; name: string }
export const defaultRole = "member";
export default function createUser(name: string): User {
  return { id: crypto.randomUUID(), name };
}

// app.ts
import createUser, { User, defaultRole } from "./user";
import type { User as UserType } from "./user"; // type-only import
```

### 11.2 Type-Only Exports/Imports

```typescript
export type { User };
import type { ComponentProps } from "react";
```

Erased at compile — no runtime import emitted when using `import type`.

### 11.3 Ambient Declarations

```typescript
// global.d.ts
declare global {
  interface Window {
    analytics: { track: (event: string) => void };
  }
}
export {};
```

### 11.4 Namespaces (Legacy — Avoid in New Code)

```typescript
namespace Utils {
  export function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
  }
}
```

Prefer ES modules. Namespaces appear in older codebases and DefinitelyTyped internals.

---

## 12. React + TypeScript Patterns

### 12.1 Component Props

```typescript
import { type ReactNode, type ComponentPropsWithoutRef } from "react";

// Basic props
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
}

function Button({ label, variant = "primary", disabled, onClick }: ButtonProps) {
  return (
    <button className={variant} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}

// Children
interface CardProps {
  title: string;
  children: ReactNode;
}

// Extending native elements
type InputProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
};

function Input({ label, error, ...rest }: InputProps) {
  return (
    <label>
      {label}
      <input {...rest} />
      {error && <span className="error">{error}</span>}
    </label>
  );
}
```

### 12.2 Hooks

```typescript
import { useState, useEffect, useReducer, useRef, useCallback } from "react";

// useState with explicit type
const [user, setUser] = useState<User | null>(null);

// useReducer
type State = { count: number };
type Action = { type: "inc" } | { type: "dec" } | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "inc": return { count: state.count + 1 };
    case "dec": return { count: state.count - 1 };
    case "reset": return { count: 0 };
  }
}

// Custom hook — return type inferred or explicit
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### 12.3 Event Handlers

```typescript
function SearchForm() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
    </form>
  );
}
```

### 12.4 Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

### 12.5 Context

```typescript
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

---

## 13. Advanced Patterns for Interviews

### 13.1 Branded Types

```typescript
type UserId = string & { readonly __brand: unique symbol };
type Email = string & { readonly __brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }

// getUser("raw-string"); // Error if not branded
```

### 13.2 satisfies Operator

```typescript
type Colors = Record<string, `#${string}`>;

const palette = {
  primary: "#ff0000",
  secondary: "#00ff00",
} satisfies Colors;

// palette.primary is "#ff0000" (literal), not just string
```

### 13.3 Template Literal Types

```typescript
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/api/${string}`;
type Route = `${HTTPMethod} ${Endpoint}`;
```

### 13.4 Module Augmentation

```typescript
// types/express.d.ts
import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; role: string };
  }
}
```

---

## 14. 15 Interview Q&A

> **Q1: What is structural typing?**  
> TypeScript checks shape compatibility, not nominal declarations. Two types with the same structure are assignable even if declared separately.

> **Q2: `interface` vs `type` — when do you pick each?**  
> Interface for extendable object contracts (props, entities). Type for unions, mapped types, tuples, and conditional logic.

> **Q3: Difference between `any` and `unknown`?**  
> `any` disables checking; you can call anything on it. `unknown` forces narrowing before use — safer for external data.

> **Q4: What does `strictNullChecks` do?**  
> `null` and `undefined` are not assignable to other types unless explicitly included (`string | null`). Eliminates a huge class of runtime bugs.

> **Q5: Explain generics with a real example.**  
> `Array<T>` — push and pop preserve element type. `fetch<User>('/api/user')` returns `Promise<User>` without casting.

> **Q6: What is a discriminated union?**  
> Union members share a literal discriminator field (`kind`, `status`). Switch/if narrows to exact member type.

> **Q7: How does `Pick` differ from `Omit`?**  
> `Pick<T, K>` keeps listed keys. `Omit<T, K>` removes listed keys. `Omit<User, 'id'>` ≡ `Pick<User, Exclude<keyof User, 'id'>>`.

> **Q8: Why avoid numeric enums in new code?**  
> They emit runtime objects, allow reverse mapping (unexpected values), and don't tree-shake as cleanly as string unions + `as const`.

> **Q9: What is `noUncheckedIndexedAccess`?**  
> Index access returns `T | undefined` because JS arrays/objects may lack that key. Forces defensive checks.

> **Q10: Explain `ReturnType` and `Parameters`.**  
> Extract return type or parameter tuple from a function type/value. Used to derive types from existing functions without duplication.

> **Q11: What is declaration merging?**  
> Multiple `interface` declarations with the same name merge. Used to extend third-party types (e.g., Express `Request`).

> **Q12: `import type` vs regular import?**  
> `import type` guarantees erasure — no runtime import. Prevents circular dependency issues and accidental value imports.

> **Q13: How do assertion functions work?**  
> `asserts val is string` tells TS the param is narrowed after call if function returns normally (throws otherwise).

> **Q14: What is the `satisfies` operator?**  
> Validates a value matches a type while preserving literal inference. Better than `: Type` annotation when you want narrow literals.

> **Q15: How do you type a React `forwardRef` component?**  
> `const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => ...)`. Ref type is first generic, props second.

---

## 15. Where to Practice

### Official & Structured Learning

| Resource | URL | Focus |
|----------|-----|-------|
| TypeScript Handbook | [typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | Canonical reference — read cover to cover |
| TS Playground | [typescriptlang.org/play](https://www.typescriptlang.org/play) | Experiment with compiler options live |
| Total TypeScript | [totaltypescript.com](https://www.totaltypescript.com/) | Matt Pocock — generics, transforms, puzzles |
| Type Challenges | [github.com/type-challenges/type-challenges](https://github.com/type-challenges/type-challenges) | LeetCode for types — interview gold |

### LeetCode / Interview Style

| Platform | Approach |
|----------|----------|
| [LeetCode](https://leetcode.com/) | Solve JS problems, then **strict rewrites in TS** with full types |
| [Exercism TypeScript track](https://exercism.org/tracks/typescript) | Small exercises with mentor feedback |
| Total TypeScript Turbo | Paid — daily type puzzles mirroring senior interviews |

### Weekly Practice Plan (30 LPA Track)

| Week | Activity |
|------|----------|
| 1–2 | Handbook + Playground — all primitive types, narrowing |
| 3–4 | Generics + utility types — implement `MyPick`, `MyPartial` |
| 5 | React + TS — type 3 components with `forwardRef`, generic `List` |
| 6 | Type Challenges (Easy → Medium) — 20 problems |
| 7+ | Refactor a MERN feature to strict TS with `noUncheckedIndexedAccess` |

### Mock Interview Prompts

1. Design types for a paginated REST API with error codes.
2. Implement `deepPartial<T>` without built-in utilities.
3. Type a Redux slice or Zustand store from scratch.
4. Explain how you'd migrate a 50k LOC JS codebase to strict TS.

---

**Next in bootcamp:** [03-react-complete.md](./03-react-complete.md) — React 18 with TypeScript integration.
