# JavaScript — Complete Notes

---

## 1. Variables & Data Types

### var vs let vs const

| Keyword | Scope | Reassign | Redeclare | Hoisted |
|---------|-------|----------|-----------|---------|
| `var` | Function | Yes | Yes | Yes (undefined) |
| `let` | Block | Yes | No | Temporal dead zone |
| `const` | Block | No* | No | Temporal dead zone |

*Objects/arrays can be mutated even with const.

```javascript
const user = { name: "Amit" };
user.name = "Rahul"; // OK — mutating object
user = {};           // Error — reassigning reference
```

### Primitive types (7 types)

1. `string` — text
2. `number` — integers & floats (no separate int/float)
3. `boolean` — true/false
4. `undefined` — declared but not assigned
5. `null` — intentional absence of value
6. `symbol` — unique identifier (ES6)
7. `bigint` — large integers

### Reference types

- `object`, `array`, `function`, `date`, etc. — stored by reference

### Type coercion

```javascript
"5" + 3      // "53"  (string concatenation)
"5" - 3      // 2     (string coerced to number)
null == undefined  // true
null === undefined // false
0 == false   // true
0 === false  // false
```

**Interview rule:** Always use `===` unless you have a reason for `==`.

---

## 2. Functions & Scope

### Function declarations vs expressions

```javascript
// Hoisted — can call before definition
function greet(name) {
  return `Hello, ${name}`;
}

// Not hoisted
const greet = function(name) {
  return `Hello, ${name}`;
};

// Arrow function — no own `this`, no `arguments`
const greet = (name) => `Hello, ${name}`;
```

### Scope chain

- **Global scope** — accessible everywhere
- **Function scope** — `var` is function-scoped
- **Block scope** — `let`/`const` are block-scoped

```javascript
function outer() {
  let a = 1;
  function inner() {
    let b = 2;
    console.log(a); // 1 — closure access
  }
  inner();
  // console.log(b); // ReferenceError
}
```

### Closures

A closure = function + its lexical environment (variables from outer scope).

```javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
```

**Use cases:** data privacy, factory functions, event handlers, debounce/throttle.

---

## 3. `this` keyword

| Call style | `this` value |
|------------|--------------|
| Regular function (non-strict) | Global object (window) |
| Regular function (strict) | undefined |
| Method call `obj.fn()` | `obj` |
| Arrow function | Lexical `this` (from enclosing scope) |
| `call/apply/bind` | Explicitly set |
| `new Constructor()` | New empty object |

```javascript
const obj = {
  name: "Test",
  regular: function() { return this.name; },
  arrow: () => this?.name, // NOT obj — lexical this
};
obj.regular(); // "Test"
```

---

## 4. Prototypes & Classes

### Prototype chain

Every object has `[[Prototype]]` (accessed via `__proto__` or `Object.getPrototypeOf`).

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

const p = new Person("Amit");
p.greet(); // "Hi, I'm Amit"
// Chain: p → Person.prototype → Object.prototype → null
```

### ES6 Classes (syntactic sugar over prototypes)

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hi, I'm ${this.name}`;
  }
  static createGuest() {
    return new Person("Guest");
  }
}
class Employee extends Person {
  constructor(name, role) {
    super(name);
    this.role = role;
  }
}
```

---

## 5. Arrays — Essential Methods

| Method | Returns | Mutates? |
|--------|---------|----------|
| `map(fn)` | New array | No |
| `filter(fn)` | New array | No |
| `reduce(fn, init)` | Single value | No |
| `find(fn)` | First match or undefined | No |
| `findIndex(fn)` | Index or -1 | No |
| `some(fn)` | boolean | No |
| `every(fn)` | boolean | No |
| `sort(fn)` | Same array | **Yes** |
| `splice()` | Removed items | **Yes** |
| `slice()` | New array | No |
| `flat(depth)` | Flattened array | No |

```javascript
const users = [
  { name: "A", age: 25 },
  { name: "B", age: 30 },
];

const names = users.map(u => u.name);
const adults = users.filter(u => u.age >= 18);
const totalAge = users.reduce((sum, u) => sum + u.age, 0);
```

---

## 6. Objects

```javascript
// Destructuring
const { name, age = 18 } = user;
const { name: userName } = user; // rename

// Spread
const updated = { ...user, age: 26 };

// Optional chaining
user?.address?.city; // undefined if any part missing

// Nullish coalescing
const port = config.port ?? 3000; // only null/undefined trigger default
```

---

## 7. Asynchronous JavaScript

### Event Loop (CRITICAL for interviews)

```
┌───────────────────────────┐
│        Call Stack         │  ← synchronous code runs here
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│     Microtask Queue       │  ← Promise.then, queueMicrotask
└───────────────────────────┘  (runs BEFORE next macrotask)
            ↓
┌───────────────────────────┐
│     Macrotask Queue       │  ← setTimeout, setInterval, I/O
└───────────────────────────┘
```

**Order:** Sync code → all microtasks → one macrotask → repeat

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1, 4, 3, 2
```

### Promises

States: `pending` → `fulfilled` | `rejected`

```javascript
const fetchUser = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve({ id: 1, name: "Amit" }), 1000);
  });

fetchUser()
  .then(user => console.log(user))
  .catch(err => console.error(err))
  .finally(() => console.log("done"));
```

### async/await

```javascript
async function getUser() {
  try {
    const res = await fetch("/api/user");
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
```

### Promise.all vs allSettled vs race

```javascript
Promise.all([p1, p2]);        // fails fast if any rejects
Promise.allSettled([p1, p2]); // waits for all, never rejects
Promise.race([p1, p2]);       // first to settle wins
```

---

## 8. Error Handling

```javascript
try {
  JSON.parse(invalidJson);
} catch (error) {
  console.error(error.message);
} finally {
  console.log("cleanup");
}

// Custom errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
```

---

## 9. Modules (ES6)

```javascript
// math.js
export const add = (a, b) => a + b;
export default function multiply(a, b) { return a * b; }

// app.js
import multiply, { add } from "./math.js";
```

---

## 10. Important Interview Implementations

### Debounce
Delays execution until user stops triggering (search input).

### Throttle
Limits execution to once per time window (scroll, resize).

### Deep clone
Handle nested objects, arrays, dates, circular references.

### Flatten array
Recursive or iterative flatten without `.flat()`.

### Curry
Transform `f(a,b,c)` into `f(a)(b)(c)`.

See [practice/week-01-exercises.md](../practice/week-01-exercises.md) for implementations.
