# TypeScript — Complete Notes

---

## 1. Why TypeScript?

- **Catch errors at compile time** instead of runtime
- **Better IDE support** — autocomplete, refactoring
- **Self-documenting code** — types explain intent
- **Required at 30 LPA companies** — Adobe, Salesforce, Google full-stack roles

TypeScript = JavaScript + static types. Compiles to plain JS.

---

## 2. Basic Types

```typescript
let name: string = "Amit";
let age: number = 25;
let isActive: boolean = true;
let ids: number[] = [1, 2, 3];
let tuple: [string, number] = ["Amit", 25];

// any — avoid in production
let anything: any = "hello";

// unknown — safer than any (must narrow before use)
let input: unknown = getUserInput();
if (typeof input === "string") {
  console.log(input.toUpperCase());
}

// void — function returns nothing
function log(msg: string): void {
  console.log(msg);
}

// never — function never returns (throws or infinite loop)
function fail(msg: string): never {
  throw new Error(msg);
}
```

---

## 3. Interfaces vs Types

```typescript
// Interface — extendable, good for object shapes
interface User {
  id: number;
  name: string;
  email?: string; // optional
  readonly createdAt: Date; // cannot reassign
}

interface Admin extends User {
  role: "admin";
}

// Type alias — unions, intersections, primitives
type Status = "pending" | "active" | "banned";
type ID = string | number;
type ApiResult = { success: true; data: User } | { success: false; error: string };
```

**When to use which:**
- **Interface** — object shapes, classes, library APIs
- **Type** — unions, tuples, mapped types

---

## 4. Functions

```typescript
function add(a: number, b: number): number {
  return a + b;
}

// Optional & default params
function greet(name: string, greeting = "Hello"): string {
  return `${greeting}, ${name}`;
}

// Function type
type MathOp = (a: number, b: number) => number;
const multiply: MathOp = (a, b) => a * b;
```

---

## 5. Generics

Reusable components that work with multiple types.

```typescript
function identity<T>(value: T): T {
  return value;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Generic class
class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}
```

---

## 6. Utility Types (Interview favorites)

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PartialUser = Partial<User>;           // all fields optional
type RequiredUser = Required<User>;         // all fields required
type UserPreview = Pick<User, "id" | "name">;
type UserWithoutPassword = Omit<User, "password">;
type ReadonlyUser = Readonly<User>;
type UserRecord = Record<string, User>;     // { [key: string]: User }
```

---

## 7. Type Guards & Narrowing

```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // TS knows it's string
  }
  return value.toFixed(2); // TS knows it's number
}

// Custom type guard
function isUser(obj: unknown): obj is User {
  return typeof obj === "object" && obj !== null && "id" in obj;
}
```

---

## 8. Enums

```typescript
enum Role {
  User = "USER",
  Admin = "ADMIN",
  Moderator = "MODERATOR",
}

// Prefer const objects in modern TS
const Role = {
  User: "USER",
  Admin: "ADMIN",
} as const;
type Role = typeof Role[keyof typeof Role];
```

---

## 9. tsconfig.json essentials

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**Always enable `strict: true`** for production code.

---

## 10. TypeScript with React (preview)

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}>{label}</button>
);
```

Full React + TS patterns in [03-react.md](./03-react.md).

---

## 11. Common Interview Questions

1. Difference between `interface` and `type`?
2. What is `never` vs `void`?
3. Explain generics with an example
4. What are utility types? Name 5.
5. What is type narrowing?
6. Difference between `any` and `unknown`?
