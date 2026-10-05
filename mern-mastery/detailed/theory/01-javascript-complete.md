# JavaScript — Complete Theory Guide (Zero to Interview Ready)

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 17 Aug 2026 – 6 Sep 2026 (Days 1–21)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **MERN Bootcamp — Module 01 | Target: 30 LPA+ Roles in India (2026)**

> **Beginner?** Open **`00-beginner-glossary.pdf`** first — every term is written in full (no unexplained short forms like "TDZ" or "REPL").

---

## How to Use This Guide

| Who This Is For | What You'll Gain |
|-----------------|------------------|
| Absolute beginners with zero programming background | Solid JS fundamentals that survive senior-level interviews |
| Bootcamp students preparing for MERN stack | Deep theory before React, Node, Express, MongoDB |
| Working developers targeting 30 LPA+ in India | Interview-ready depth on closures, event loop, async, prototypes |

**Goal:** By the end of this document, you should be able to explain *why* JavaScript behaves the way it does — not just *what* the syntax looks like. Indian product companies (Flipkart, Razorpay, Swiggy, PhonePe, Atlassian India, etc.) and service-based MNCs (TCS Digital, Infosys, Wipro) test JavaScript fundamentals heavily in DSA rounds, machine coding, and system design discussions.

**How to study (6-month bootcamp pacing):**

1. **Week 1–2:** Sections 1–7 (History → Closures). Code every example in VS Code + browser console.
2. **Week 3:** Sections 8–12 (this → Objects/Arrays). Build a mini todo app using only vanilla JS.
3. **Week 4:** Sections 13–17 (Errors → async/await). Solve 20 LeetCode Easy/Medium in JS.
4. **Week 5:** Sections 18–19 (Modules → Utility patterns). Implement debounce/throttle/curry from scratch.
5. **Week 6:** Section 20 (Interview bank) + timed mock interviews.

**Rules while studying:**
- Never copy-paste without typing and predicting the output first.
- After each section, close the tab and explain the concept aloud in 2 minutes.
- Revisit Sections 7 (Closures), 14 (Event Loop), and 15–16 (Promises/async) at least 3 times — these appear in 80%+ of JS interviews.
- **Code examples:** Lines marked with `// comments` expand into **Line-by-line explanation** tables in the PDF — read both the code and the table.

---

## Table of Contents

1. [History & Role of JavaScript](#1-history--role-of-javascript)
2. [Variables: var, let, const](#2-variables-var-let-const)
3. [Data Types, Coercion & Equality](#3-data-types-coercion--equality)
4. [Operators & Modern Syntax](#4-operators--modern-syntax)
5. [Functions](#5-functions)
6. [Scope](#6-scope)
7. [Closures](#7-closures)
8. [The `this` Keyword](#8-the-this-keyword)
9. [Prototypes & Classes](#9-prototypes--classes)
10. [Arrays — Complete Reference](#10-arrays--complete-reference)
11. [Objects — Complete Reference](#11-objects--complete-reference)
12. [Strings, Numbers, Math & Date](#12-strings-numbers-math--date)
13. [Error Handling](#13-error-handling)
14. [The Event Loop](#14-the-event-loop)
15. [Promises](#15-promises)
16. [async/await](#16-asyncawait)
17. [Fetch API & JSON](#17-fetch-api--json)
18. [ES Modules vs CommonJS](#18-es-modules-vs-commonjs)
19. [Utility Patterns: Debounce, Throttle, Deep Clone, Curry](#19-utility-patterns-debounce-throttle-deep-clone-curry)
20. [Interview Question Bank](#20-interview-question-bank)
21. [Where to Practice](#21-where-to-practice)

---

## 1. History & Role of JavaScript

### Theory

JavaScript was created by **Brendan Eich** at Netscape in **1995** in just **10 days**. Originally named "Mocha," then "LiveScript," it was renamed "JavaScript" for marketing reasons (Java was popular). Despite the name, JavaScript has almost nothing in common with Java.

| Year | Milestone |
|------|-----------|
| 1995 | JavaScript created for Netscape Navigator |
| 1997 | ECMAScript (official JavaScript standard) standardization begins |
| 2009 | ECMAScript 5 — strict mode, JSON support |
| 2015 | **ECMAScript 2015** (also called ES6) — classes, modules, arrow functions, promises |
| 2015+ | Annual ECMAScript releases (2016, 2017, … 2024) |
| Today | Runs everywhere: browsers, servers (Node.js), mobile (React Native), desktop (Electron), Internet of Things |

**JavaScript's role in MERN stack:**
- **M**ongoDB — document database queried via JavaScript driver
- **E**xpress — JavaScript web framework on Node.js
- **R**eact — JavaScript user interface library (JSX syntax compiles to JavaScript)
- **N**ode.js — JavaScript runtime outside the browser

### Runtime Environments: Browser vs Node.js

| Feature | Browser | Node.js |
|---------|---------|---------|
| Global object | `window` | `global` (or `globalThis`) |
| Document Object Model access | Yes (`document`, `window`) | No |
| File system | No (sandboxed) | Yes (`fs` module) |
| Module system | ES Modules (+ bundlers) | CommonJS + ES Modules |
| Event loop | Web Application Programming Interfaces + microtasks | libuv thread pool + phases |
| `console` | DevTools console | Terminal stdout |

```javascript
// Browser-only
console.log(window.location.href);
document.getElementById('app');

// Node.js-only
const fs = require('fs'); // CommonJS
fs.readFileSync('./file.txt', 'utf8');

// Universal (ES2020+)
console.log(globalThis); // works in both environments
```

**V8 Engine:** Both Chrome and Node.js use Google's V8 engine to compile JavaScript to machine code. SpiderMonkey (Firefox) and JavaScriptCore (Safari) are other engines — behavior is standardized by ECMAScript, but subtle timing differences exist.

### Common Mistakes

- Assuming JavaScript is "just a browser language" — Node.js powers Netflix, PayPal, LinkedIn backends.
- Confusing JavaScript with Java in interviews — instant red flag.
- Ignoring which runtime you're in (e.g., using `window` in Node without checking).

### Interview Tips

- Be ready to explain: "JavaScript is single-threaded but non-blocking thanks to the event loop."
- Know that JS is **dynamically typed** and **multi-paradigm** (OOP, functional, procedural).
- Mention ECMAScript vs JavaScript: ECMAScript is the official specification; JavaScript is the language implementation in browsers and Node.js.

---

## 2. Variables: var, let, const

### Theory

JavaScript provides three ways to declare variables:

| Keyword | Scope | Hoisted | Reassignable | Redeclarable | Temporal Dead Zone |
|---------|-------|---------|--------------|--------------|---------------------|
| `var` | Function (or global) | Yes (initialized `undefined`) | Yes | Yes | No |
| `let` | Block | Yes (not initialized) | Yes | No | Yes |
| `const` | Block | Yes (not initialized) | No* | No | Yes |

*`const` prevents reassignment of the binding, not mutation of object contents.

<!-- line-explain -->
```javascript
// var — function scoped (leaks out of if/for blocks)
function example() {
  if (true) {
    var x = 10;                      // var is hoisted to function top; visible after this block
  }
  console.log(x);                    // 10 — x "leaked" out of the if block
}

// let — block scoped (stays inside { })
function example2() {
  if (true) {
    let y = 10;                      // y exists only inside this block
  }
  // console.log(y);                 // ReferenceError — y is not defined outside block
}

// const — must initialize; cannot reassign the variable name
const PI = 3.14159;                  // Must assign immediately
// PI = 3;                           // TypeError — cannot reassign const binding

const user = { name: 'Aarav' };      // const locks the reference, not the object
user.name = 'Vihaan';                // OK — mutating object property
// user = {};                        // TypeError — cannot point user to a new object
```

### Hoisting

Hoisting is JavaScript's behavior of moving declarations to the top of their scope during the compilation phase.

<!-- line-explain -->
```javascript
console.log(a);                      // undefined — var a was hoisted and set to undefined
var a = 5;                           // Assignment happens here (after the log above)

// What the engine effectively does for var:
var a;                               // Declaration hoisted to top of scope
console.log(a);                      // undefined (initialized as undefined)
a = 5;                               // Assignment stays in place

console.log(b);                      // ReferenceError — in Temporal Dead Zone (cannot use before declaration line)
let b = 10;                          // let is hoisted but NOT initialized until this line
```

**Temporal Dead Zone:** The period between entering scope and the `let`/`const` declaration line. Accessing the variable during the Temporal Dead Zone throws `ReferenceError`. (We do not use the short form "TDZ" in beginner sections.)

<!-- line-explain -->
```javascript
{
  // Temporal Dead Zone starts for `value` — name exists but cannot be accessed yet
  // console.log(value);            // ReferenceError if uncommented
  let value = 42;                    // Temporal Dead Zone ends here — value is initialized
  console.log(value);                // 42 — safe to use now
}
```

### Best Practices

1. **Default to `const`** — use `let` only when reassignment is needed.
2. **Never use `var`** in modern code (legacy codebases may still have it).
3. Declare variables at the top of their block for readability.
4. Use descriptive names: `isLoggedIn`, `totalPrice`, `fetchUserById`.

```javascript
// Good
const MAX_RETRIES = 3;
let attemptCount = 0;

// Bad
var x = 3;
var y = 0;
```

### Common Mistakes

```javascript
// Mistake 1: var in loops
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 3, 3, 3
}

// Fix with let
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100); // prints 0, 1, 2
}

// Mistake 2: thinking const makes objects immutable
const arr = [1, 2];
arr.push(3); // works! arr is [1, 2, 3]
```

### Interview Tips

- Explain hoisting with `var` vs `let`/`const` — interviewers love **Temporal Dead Zone** questions.
- Know that `typeof undeclaredVar` returns `"undefined"` but accessing it throws in strict mode for `let`/`const`.
- Be ready to draw scope chain diagrams for nested functions.

---

## 3. Data Types, Coercion & Equality

### Theory — 8 Data Types

JavaScript has **7 primitive types** + **1 reference type (Object)**:

| Type | typeof result | Example |
|------|---------------|---------|
| `undefined` | `"undefined"` | `let x;` |
| `boolean` | `"boolean"` | `true`, `false` |
| `number` | `"number"` | `42`, `3.14`, `NaN`, `Infinity` |
| `bigint` | `"bigint"` | `9007199254740991n` |
| `string` | `"string"` | `"hello"` |
| `symbol` | `"symbol"` | `Symbol('id')` |
| `null` | `"object"` ⚠️ | `null` |
| `object` | `"object"` | `{}`, `[]`, `function` ⚠️ |

### typeof Quirks

<!-- line-explain -->
```javascript
typeof null;                         // "object" — famous bug, never fixed for compatibility
typeof [];                           // "object" — arrays are objects in JS
typeof function(){};                 // "function" — special case (functions are callable objects)
typeof NaN;                          // "number" — NaN is still the number type
typeof undefined;                    // "undefined"
typeof 42n;                          // "bigint" — ES2020 big integers
typeof Symbol();                     // "symbol" — unique identifier type
```

**Better null check:**

```javascript
value === null;                    // strict
Object.prototype.toString.call(null); // "[object Null]"
```

### Truthy and Falsy — Complete List

**Falsy values (only 8):**

| Value | Notes |
|-------|-------|
| `false` | Boolean false |
| `0` | Number zero |
| `-0` | Negative zero |
| `0n` | BigInt zero |
| `""` | Empty string |
| `null` | Null |
| `undefined` | Undefined |
| `NaN` | Not a Number |

**Everything else is truthy**, including:

```javascript
Boolean([]);        // true — empty array is truthy!
Boolean({});        // true — empty object is truthy!
Boolean("0");       // true — string "0" is truthy
Boolean("false");   // true — string "false" is truthy
Boolean(function(){}); // true
```

### Type Coercion

**Implicit coercion** happens when JS converts types automatically:

<!-- line-explain -->
```javascript
"5" + 3;                             // "53" — + with string triggers string concatenation
"5" - 3;                             // 2 — - forces numeric conversion
"5" * "2";                           // 10 — * and / always convert to numbers
true + 1;                            // 2 — true coerces to 1 in numeric context
false + 1;                           // 1 — false coerces to 0
[] + [];                             // "" — both arrays become "" then concat
[] + {};                             // "[object Object]" — {} becomes string via toString()
{} + [];                             // 0 or "[object Object]" — depends on parse context
```

**Explicit coercion:**

```javascript
Number("42");     // 42
String(42);       // "42"
Boolean(1);       // true
parseInt("42px"); // 42
parseFloat("3.14"); // 3.14
```

### == vs ===

| Operator | Name | Behavior |
|----------|------|----------|
| `==` | Loose equality | Compares with type coercion |
| `===` | Strict equality | Compares type AND value, no coercion |
| `!=` | Loose inequality | Coercion applied |
| `!==` | Strict inequality | No coercion |

```javascript
// == coercion rules (memorize these for interviews)
null == undefined;   // true
null == 0;           // false
undefined == 0;      // false
"5" == 5;            // true
"" == 0;             // true
false == 0;          // true
[] == false;         // true
[] == ![];           // true — infamous trick question

// === — always prefer this
"5" === 5;           // false
null === undefined;  // false
NaN === NaN;         // false — use Number.isNaN()
```

**Object.is()** — SameValue comparison (handles `NaN` and `-0`):

```javascript
Object.is(NaN, NaN);   // true
Object.is(-0, +0);     // false
Object.is(5, 5);       // true
```

### Common Mistakes

- Using `==` thinking it saves time — causes subtle bugs.
- Checking `if (arr)` to see if array is empty — `[].length === 0` is correct.
- Comparing objects with `===` expecting deep equality — compares references only.

### Interview Tips

- Recite all 8 falsy values from memory.
- Explain why `typeof null === "object"`.
- Know `Object.is` vs `===` difference for `NaN` and signed zero.

---

## 4. Operators & Modern Syntax

### Arithmetic & Assignment Operators

```javascript
let a = 10;
a += 5;   // 15
a **= 2;  // 225 (exponentiation, ES2016)
a ??= null; // assigns only if nullish (ES2021)

// Unary
++a;      // pre-increment
a++;      // post-increment
+a;       // unary plus (coerces to number)
!a;       // logical NOT
```

### Logical Operators

```javascript
// && — returns first falsy or last value
0 && "hello";       // 0
"hi" && "hello";    // "hello"

// || — returns first truthy or last value
0 || "default";     // "default"

// ?? — nullish coalescing (only null/undefined trigger default)
0 ?? "default";     // 0 (0 is not nullish!)
null ?? "default";  // "default"

// Combining
const name = user?.name ?? "Guest";
```

### Optional Chaining (`?.`)

```javascript
const user = {
  profile: {
    address: { city: "Bangalore" }
  }
};

user?.profile?.address?.city;  // "Bangalore"
user?.profile?.phone?.number;  // undefined (no error)

// With methods
obj.method?.();  // calls only if method exists

// With arrays
arr?.[0];        // safe index access
```

### Template Literals

```javascript
const name = "Priya";
const salary = 3000000;

// Basic
const msg = `Hello, ${name}!`;

// Multi-line
const html = `
  <div>
    <h1>${name}</h1>
    <p>CTC: ₹${(salary / 100000).toFixed(1)} LPA</p>
  </div>
`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) =>
    acc + str + (values[i] ? `<mark>${values[i]}</mark>` : ''), '');
}
highlight`Name: ${name}`; // "Name: <mark>Priya</mark>"
```

### Nullish Coalescing vs Logical OR

| Expression | `\|\|` result | `??` result |
|----------|-------------|-----------|
| `0 \|\| 10` | `10` | `0` |
| `"" \|\| "default"` | `"default"` | `""` |
| `null ?? 10` | `10` | `10` |
| `undefined ?? 10` | `10` | `10` |
| `false ?? true` | `false` | `false` |

### Common Mistakes

- Mixing `??` with `&&`/`||` without parentheses (SyntaxError in some cases).
- Using optional chaining when a null value should throw (fail-fast vs fail-safe).

### Interview Tips

- Explain short-circuit evaluation in `&&` and `||`.
- Know that `??` only checks `null` and `undefined`, not other falsy values.

---

## 5. Functions

### Function Declaration

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
// Hoisted — can call before declaration
sayHi(); // works
function sayHi() { console.log("Hi"); }
```

### Function Expression

```javascript
const greet = function(name) {
  return `Hello, ${name}!`;
};
// Not hoisted
// greet(); // works only after line above
```

### Arrow Functions (ES6)

```javascript
const add = (a, b) => a + b;
const square = x => x * x;           // single param — parens optional
const noop = () => { /* no return */ };
const getObj = () => ({ key: 1 });   // return object — wrap in ()

// Key differences from regular functions:
// 1. No own `this` — inherits from enclosing scope
// 2. No `arguments` object
// 3. Cannot be used as constructors (no `new`)
// 4. No `prototype` property
```

### IIFE — Immediately Invoked Function Expression

```javascript
(function() {
  const secret = "hidden";
  console.log("Runs immediately");
})();

// Modern alternative — block scope with let/const
{
  const secret = "hidden";
}
```

### Higher-Order Functions

A function that takes a function as argument or returns a function.

```javascript
function operate(a, b, fn) {
  return fn(a, b);
}

operate(5, 3, (x, y) => x + y); // 8

// Built-in HOFs
[1, 2, 3].map(x => x * 2);
[1, 2, 3].filter(x => x > 1);
[1, 2, 3].reduce((acc, x) => acc + x, 0);
```

### Pure Functions

A pure function:
1. Always returns the same output for the same input.
2. Has no side effects (no mutation, no I/O, no console.log in strict definition).

```javascript
// Pure
const add = (a, b) => a + b;
const double = arr => arr.map(x => x * 2);

// Impure
let count = 0;
const increment = () => ++count;           // side effect
const addRandom = x => x + Math.random();  // non-deterministic
const logAndReturn = x => { console.log(x); return x; };
```

### Default Parameters & Rest Parameters

```javascript
function createUser(name, role = "user", active = true) {
  return { name, role, active };
}

function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10
```

### Common Mistakes

- Using arrow functions as object methods when you need `this`.
- Using arrow functions as constructors.
- Forgetting that `return` on its own line in arrow functions with `{}` body needs explicit return.

### Interview Tips

- Explain hoisting difference between declarations and expressions.
- Be ready to implement `map`, `filter`, `reduce` from scratch.
- Know when pure functions matter (React, Redux, testing).

---

## 6. Scope

### Types of Scope

| Scope Type | Created By | Accessible |
|------------|------------|------------|
| Global | Outside all functions/blocks | Everywhere |
| Function | `function` keyword | Inside that function |
| Block | `{ }` with `let`/`const` | Inside that block |
| Module | ES Module file | Exported bindings only |

```javascript
const globalVar = "I'm global";

function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";
    console.log(globalVar);  // accessible
    console.log(outerVar);   // accessible — lexical scope
    console.log(innerVar);   // accessible
  }
  inner();
  // console.log(innerVar); // ReferenceError
}

outer();
```

### Lexical Scope

JavaScript uses **lexical (static) scope** — a function's scope is determined by where it is *written*, not where it is *called*.

```javascript
const x = "global";

function outer() {
  const x = "outer";
  function inner() {
    console.log(x); // "outer" — looks up lexical chain
  }
  return inner;
}

const fn = outer();
fn(); // "outer" — NOT "global"
```

### Scope Chain

When a variable is accessed, JS looks in:
1. Current scope
2. Outer scope
3. … up to global
4. If not found → `ReferenceError`

```javascript
let a = 1;
function foo() {
  let b = 2;
  function bar() {
    let c = 3;
    console.log(a, b, c); // 1, 2, 3
  }
  bar();
}
```

### Common Mistakes

- Assuming `if` blocks create function scope (only `var` leaks; `let`/`const` don't).
- Shadowing variables unintentionally:

```javascript
let count = 0;
function update() {
  let count = 1; // shadows outer count
  // ...
}
```

### Interview Tips

- Draw scope chain for nested functions — very common whiteboard task.
- Distinguish scope from context (`this` is context, not scope).

---

## 7. Closures

### Definition

A **closure** is a function that retains access to variables from its **lexical scope** even after the outer function has finished executing.

```javascript
function createCounter() {
  let count = 0; // enclosed variable

  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
counter(); // 3
// `count` is not accessible directly, but the inner function keeps it alive
```

### Classic Examples

**1. Private variables (module pattern):**

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      return balance;
    },
    getBalance() { return balance; }
  };
}

const account = createBankAccount(1000);
account.deposit(500);   // 1500
account.getBalance();   // 1500
// account.balance — undefined (private)
```

**2. Function factories:**

```javascript
function multiply(factor) {
  return (number) => number * factor;
}

const double = multiply(2);
const triple = multiply(3);
double(5); // 10
triple(5); // 15
```

**3. Event handlers / callbacks:**

```javascript
function setupButton(buttonId, message) {
  document.getElementById(buttonId).addEventListener('click', () => {
    alert(message); // closure over `message`
  });
}
```

**4. Memoization:**

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});
```

### Memory Leaks with Closures

Closures keep references alive. If you close over large objects unnecessarily, memory isn't freed.

```javascript
// LEAK: hugeData stays in memory because closure references it
function leaky() {
  const hugeData = new Array(1e6).fill('x');
  return function() {
    console.log(hugeData[0]); // keeps entire array alive
  };
}

// FIX: only close over what you need
function fixed() {
  const hugeData = new Array(1e6).fill('x');
  const first = hugeData[0];
  return function() {
    console.log(first); // hugeData can be GC'd
  };
}
```

**Common leak sources:**
- Forgotten event listeners
- Timers (`setInterval`) referencing closures
- Closures stored in global variables

### Interview Questions on Closures

```javascript
// Q1: Classic loop + setTimeout
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3

// Fix:
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2

// Q2: Multiple closures sharing same variable
function createFunctions() {
  const result = [];
  for (var i = 0; i < 3; i++) {
    result.push(function() { return i; });
  }
  return result;
}
createFunctions().map(f => f()); // [3, 3, 3]

// Q3: Module pattern output
const modules = (function() {
  let privateVar = 0;
  return {
    increment: () => ++privateVar,
    get: () => privateVar
  };
})();
modules.increment();
modules.increment();
modules.get(); // 2
```

### Interview Tips

- Define closure in one sentence: "A function bundled with its lexical environment."
- Always mention memory implications in senior interviews.
- Connect closures to React hooks (useState closure over state).

---

## 8. The `this` Keyword

### Four Rules of `this` Binding

| Rule | Condition | `this` value |
|------|-----------|--------------|
| 1. Default | Plain function call | `globalThis` (strict: `undefined`) |
| 2. Implicit | `obj.method()` | `obj` |
| 3. Explicit | `call/apply/bind` | Specified object |
| 4. `new` | `new Func()` | New empty object |

```javascript
// Rule 1: Default binding
function showThis() {
  console.log(this);
}
showThis(); // globalThis (browser: Window)

"use strict";
function strictThis() {
  console.log(this); // undefined
}

// Rule 2: Implicit binding
const user = {
  name: "Rahul",
  greet() {
    console.log(this.name);
  }
};
user.greet(); // "Rahul"

const greetFn = user.greet;
greetFn(); // undefined — lost implicit binding!

// Rule 3: Explicit binding
greetFn.call(user);  // "Rahul"
greetFn.apply(user); // "Rahul"
const bound = greetFn.bind(user);
bound(); // "Rahul"

// Rule 4: new binding
function Person(name) {
  this.name = name;
}
const p = new Person("Ananya");
console.log(p.name); // "Ananya"
```

### Arrow Functions and `this`

Arrow functions **do not have their own `this`** — they inherit from enclosing lexical scope.

```javascript
const obj = {
  name: "Test",
  regular: function() { console.log(this.name); },
  arrow: () => { console.log(this.name); }
};
obj.regular(); // "Test"
obj.arrow();   // undefined (inherits outer `this`)
```

### call, apply, bind — Implementations

```javascript
// Polyfill for Function.prototype.call
Function.prototype.myCall = function(context, ...args) {
  context = context ?? globalThis;
  const sym = Symbol('fn');
  context[sym] = this;
  const result = context[sym](...args);
  delete context[sym];
  return result;
};

// Polyfill for Function.prototype.apply
Function.prototype.myApply = function(context, args = []) {
  return this.myCall(context, ...args);
};

// Polyfill for Function.prototype.bind
Function.prototype.myBind = function(context, ...boundArgs) {
  const fn = this;
  return function(...callArgs) {
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
};

// Usage
function introduce(city) {
  console.log(`${this.name} from ${city}`);
}
introduce.myCall({ name: "Kavya" }, "Mumbai");
const boundIntro = introduce.myBind({ name: "Kavya" }, "Delhi");
boundIntro(); // "Kavya from Delhi"
```

### Common Mistakes

- Losing `this` when passing methods as callbacks — always `bind` or use arrow wrapper.
- Using arrow functions as object methods when `this` is needed.
- Confusing `this` with scope/closures.

### Interview Tips

- Priority: `new` > explicit (`call/apply/bind`) > implicit > default.
- Implement `bind` from scratch — very common.
- Explain `this` in class methods vs arrow class fields in React components.

---

## 9. Prototypes & Classes

### Prototype Chain

Every JavaScript object has an internal `[[Prototype]]` link (accessed via `__proto__` or `Object.getPrototypeOf()`).

```javascript
const animal = {
  eats: true,
  walk() { console.log("walking"); }
};

const rabbit = Object.create(animal);
rabbit.hops = true;

rabbit.walk(); // "walking" — found on prototype
console.log(rabbit.eats); // true

// Chain: rabbit → animal → Object.prototype → null
```

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

const p = new Person("Dev");
p.greet(); // "Hi, I'm Dev"
console.log(p.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
```

### Object.create

```javascript
const proto = {
  greet() { return `Hello, ${this.name}`; }
};

const user = Object.create(proto);
user.name = "Sam";
user.greet(); // "Hello, Sam"

// Object.create with property descriptors
const obj = Object.create(Object.prototype, {
  name: { value: "Fixed", writable: false, enumerable: true }
});
```

### ES6 Classes

```javascript
class Employee {
  // Private field (ES2022)
  #salary;

  // Static property
  static company = "TechCorp India";

  constructor(name, salary) {
    this.name = name;
    this.#salary = salary;
  }

  // Instance method
  getDetails() {
    return `${this.name} earns ${this.#salary}`;
  }

  // Getter / Setter
  get annualSalary() {
    return this.#salary * 12;
  }

  set annualSalary(val) {
    this.#salary = val / 12;
  }

  // Static method
  static createIntern(name) {
    return new Employee(name, 25000);
  }

  // Private method
  #calculateBonus() {
    return this.#salary * 0.1;
  }
}

class Manager extends Employee {
  constructor(name, salary, team) {
    super(name, salary);
    this.team = team;
  }

  getDetails() {
    return `${super.getDetails()}, manages ${this.team.length} people`;
  }
}

const mgr = new Manager("Neha", 200000, ["A", "B", "C"]);
mgr.getDetails();
```

**Classes are syntactic sugar over prototypes:**

```javascript
typeof Employee;               // "function"
Employee.prototype.constructor === Employee; // true
```

### Common Mistakes

- Modifying `Object.prototype` directly — affects all objects globally.
- Confusing `__proto__` (instance link) with `prototype` (constructor property).
- Forgetting `super()` in derived class constructor.

### Interview Tips

- Draw prototype chain diagram for `new` keyword step by step.
- Explain difference between `__proto__` and `prototype`.
- Implement inheritance without `class` using `Object.create`.

---

## 10. Arrays — Complete Reference

### Creating Arrays

```javascript
const arr1 = [1, 2, 3];
const arr2 = new Array(3);       // [empty × 3] — sparse!
const arr3 = Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
const arr4 = Array.of(7);        // [7] — not [empty × 7]
const arr5 = [...arr1];          // shallow copy
```

### Mutating Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `push(...items)` | new length | Add to end |
| `pop()` | removed item | Remove from end |
| `unshift(...items)` | new length | Add to start |
| `shift()` | removed item | Remove from start |
| `splice(start, deleteCount, ...items)` | deleted items | Add/remove at index |
| `sort(compareFn?)` | same array | Sort in place |
| `reverse()` | same array | Reverse in place |
| `fill(value, start?, end?)` | same array | Fill with value |
| `copyWithin(target, start, end?)` | same array | Copy section |

```javascript
const nums = [3, 1, 4, 1, 5];
nums.push(9);           // [3, 1, 4, 1, 5, 9]
nums.pop();             // [3, 1, 4, 1, 5]
nums.splice(1, 2, 99);  // [3, 99, 1, 5] — removed 1,4; inserted 99
nums.sort((a, b) => a - b); // numeric sort!
```

### Non-Mutating Methods

| Method | Returns | Use When |
|--------|---------|----------|
| `concat(...arrays)` | new array | Merge arrays |
| `slice(start?, end?)` | new array | Extract portion |
| `indexOf(value)` | index or -1 | Find first index |
| `lastIndexOf(value)` | index or -1 | Find last index |
| `includes(value)` | boolean | Check existence |
| `find(predicate)` | element or undefined | Find first match |
| `findIndex(predicate)` | index or -1 | Index of first match |
| `findLast(predicate)` | element or undefined | ES2023 |
| `findLastIndex(predicate)` | index or -1 | ES2023 |

### Iteration Methods (Functional)

| Method | Returns | Use When |
|--------|---------|----------|
| `forEach(fn)` | undefined | Side effects only |
| `map(fn)` | new array | Transform each element |
| `filter(fn)` | new array | Keep matching elements |
| `reduce(fn, init?)` | accumulator | Aggregate to single value |
| `reduceRight(fn, init?)` | accumulator | Reduce right-to-left |
| `some(fn)` | boolean | Any element matches? |
| `every(fn)` | boolean | All elements match? |
| `flat(depth?)` | new array | Flatten nested arrays |
| `flatMap(fn)` | new array | map + flat(1) |

```javascript
const products = [
  { name: "Laptop", price: 65000, category: "electronics" },
  { name: "Book", price: 499, category: "education" },
  { name: "Phone", price: 45000, category: "electronics" },
];

// map — transform
const names = products.map(p => p.name);

// filter — select
const electronics = products.filter(p => p.category === "electronics");

// reduce — aggregate
const total = products.reduce((sum, p) => sum + p.price, 0);

// find — single item
const book = products.find(p => p.category === "education");

// some / every
products.some(p => p.price > 50000);  // true
products.every(p => p.price > 0);     // true

// flatMap
const sentences = ["hello world", "foo bar"];
sentences.flatMap(s => s.split(" ")); // ["hello", "world", "foo", "bar"]
```

### ES2023+ Array Methods

```javascript
const arr = [1, 2, 3, 4, 5];

// toReversed, toSorted, toSpliced, with — non-mutating versions
arr.toReversed();           // [5, 4, 3, 2, 1]
arr.toSorted((a, b) => b - a); // [5, 4, 3, 2, 1]
arr.with(2, 99);            // [1, 2, 99, 4, 5] — replace index 2
```

### Common Mistakes

- Using `sort()` without compare function on numbers: `[10, 2, 1].sort()` → `[1, 10, 2]`.
- Using `forEach` when you need to break early (use `for...of` or `some`).
- Confusing `map` (returns array) with `forEach` (returns undefined).

### Interview Tips

- Implement `map`, `filter`, `reduce`, `flat` from scratch.
- Know time complexity: `push/pop` O(1), `shift/unshift` O(n), `sort` O(n log n).
- Explain sparse vs dense arrays.

---

## 11. Objects — Complete Reference

### Creating Objects

```javascript
// Object literal
const user = { name: "Arjun", age: 28 };

// Constructor
const obj = new Object();
obj.key = "value";

// Object.create
const proto = { greet() { return "hi"; } };
const child = Object.create(proto);

// Factory function
function createUser(name) {
  return { name, createdAt: new Date() };
}

// class (see Section 9)
```

### Object Static Methods

```javascript
const target = { a: 1 };
const source = { b: 2, c: 3 };

Object.assign(target, source);  // { a: 1, b: 2, c: 3 } — shallow merge
Object.keys(obj);               // ["name", "age"]
Object.values(obj);             // ["Arjun", 28]
Object.entries(obj);            // [["name","Arjun"], ["age",28]]
Object.fromEntries([["a", 1]]); // { a: 1 }

"a" in obj;                     // true — checks prototype chain
obj.hasOwnProperty("name");     // true — own property only
Object.hasOwn(obj, "name");     // ES2022 — safer alternative
```

### freeze, seal, preventExtensions

| Method | Add | Delete | Modify | Reconfigure |
|--------|-----|--------|--------|-------------|
| `preventExtensions` | ❌ | ✅ | ✅ | ✅ |
| `seal` | ❌ | ❌ | ✅ | ❌ |
| `freeze` | ❌ | ❌ | ❌ | ❌ |

```javascript
const config = Object.freeze({ apiUrl: "https://api.example.com" });
config.apiUrl = "hacked"; // silently fails (strict mode: TypeError)
config.newKey = 1;        // fails

const sealed = Object.seal({ count: 0 });
sealed.count = 5;   // OK
delete sealed.count; // fails
```

### Property Descriptors

```javascript
const obj = {};

Object.defineProperty(obj, "id", {
  value: 42,
  writable: false,      // cannot change value
  enumerable: false,    // hidden from for...in / Object.keys
  configurable: false   // cannot delete or reconfigure
});

Object.defineProperties(obj, {
  name: { value: "Test", writable: true, enumerable: true },
  secret: { value: "hidden", enumerable: false }
});

const desc = Object.getOwnPropertyDescriptor(obj, "id");
// { value: 42, writable: false, enumerable: false, configurable: false }
```

### Destructuring

```javascript
const user = { name: "Isha", age: 25, city: "Pune", role: "developer" };

// Basic
const { name, age } = user;

// Rename
const { name: userName } = user;

// Default values
const { country = "India" } = user;

// Rest
const { name: n, ...rest } = user; // rest = { age, city, role }

// Nested
const data = { user: { profile: { email: "a@b.com" } } };
const { user: { profile: { email } } } = data;

// Function parameters
function greet({ name, age = 18 }) {
  console.log(`${name} is ${age}`);
}
```

### Spread & Rest

```javascript
// Spread — expand iterable
const defaults = { theme: "dark", lang: "en" };
const userPrefs = { lang: "hi", fontSize: 14 };
const settings = { ...defaults, ...userPrefs };
// { theme: "dark", lang: "hi", fontSize: 14 }

// Clone (shallow!)
const clone = { ...original };

// Rest in destructuring
const [first, ...remaining] = [1, 2, 3, 4]; // first=1, remaining=[2,3,4]

// Rest in function params
function log(type, ...messages) {
  messages.forEach(m => console.log(`[${type}] ${m}`));
}
```

### Common Mistakes

- Thinking `{ ...obj }` is a deep clone — nested objects share references.
- Using `Object.freeze` expecting deep immutability — it's shallow only.
- Destructuring `undefined`: `const { x } = undefined` throws TypeError.

### Interview Tips

- Implement shallow and deep clone functions.
- Explain difference between `in` operator and `hasOwnProperty`.
- Know property descriptor flags for defining reactive/getter properties.

---

## 12. Strings, Numbers, Math & Date

### Strings

```javascript
const str = "Hello, MERN Bootcamp!";

// Access
str[0];              // "H"
str.charAt(0);       // "H"
str.at(-1);          // "!" — ES2022, supports negative index

// Search
str.indexOf("MERN");     // 7
str.includes("Boot");    // true
str.startsWith("Hello"); // true
str.endsWith("!");       // true

// Extract
str.slice(7, 11);    // "MERN"
str.substring(7, 11);  // "MERN" — swaps if start > end
str.substr(7, 4);    // "MERN" — deprecated

// Transform
str.toLowerCase();
str.toUpperCase();
str.trim();          // remove whitespace both ends
str.trimStart();
str.replace("MERN", "Full Stack");
str.replaceAll("e", "E"); // ES2021

// Split & Join
str.split(", ");     // ["Hello", "MERN Bootcamp!"]
["a", "b"].join("-"); // "a-b"

// Template literals (see Section 4)
`Length: ${str.length}`; // 20

// Padding
"5".padStart(3, "0");  // "005"
"5".padEnd(3, "0");    // "500"

// Repeat
"ha".repeat(3);        // "hahaha"
```

### Numbers

```javascript
// Special values
Infinity;
-Infinity;
NaN; // result of invalid math: 0/0, "abc" * 2

Number.isNaN(NaN);       // true
Number.isNaN("hello");   // false (unlike global isNaN)
Number.isFinite(42);     // true
Number.isInteger(3.0);   // true

// Parsing
parseInt("42px", 10);    // 42 — always specify radix!
parseFloat("3.14em");    // 3.14
Number("42");            // 42
Number("");              // 0
Number(null);            // 0
Number(undefined);       // NaN

// Formatting
(1234567.89).toLocaleString("en-IN"); // "12,34,567.89"
(3000000).toLocaleString("en-IN", { style: "currency", currency: "INR" });
// "₹30,00,000.00"

// Safe integer range
Number.MAX_SAFE_INTEGER; // 9007199254740991 (2^53 - 1)
Number.MIN_SAFE_INTEGER;

// BigInt for larger integers
const big = 9007199254740991n + 1n;
```

### Math

```javascript
Math.PI;           // 3.141592653589793
Math.E;            // 2.718281828459045

Math.abs(-5);      // 5
Math.ceil(4.1);    // 5
Math.floor(4.9);   // 4
Math.round(4.5);   // 5
Math.trunc(4.9);   // 4

Math.max(1, 5, 3); // 5
Math.min(1, 5, 3); // 1
Math.pow(2, 10);   // 1024
2 ** 10;           // 1024 — exponentiation operator

Math.sqrt(16);     // 4
Math.cbrt(27);     // 3 — cube root
Math.hypot(3, 4);  // 5 — √(3² + 4²)

Math.random();     // 0 <= n < 1
// Random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### Date

```javascript
const now = new Date();
const specific = new Date("2026-07-30T10:00:00+05:30");
const fromParts = new Date(2026, 6, 30); // month is 0-indexed!

now.getFullYear();    // 2026
now.getMonth();       // 6 (July)
now.getDate();        // 30
now.getDay();         // 0-6 (Sun-Sat)
now.getHours();
now.getTime();        // Unix timestamp in ms

now.toISOString();    // "2026-07-30T..."
now.toLocaleDateString("en-IN"); // "30/7/2026"

// Timestamp
Date.now();           // current ms since epoch

// Difference in days
const diff = (date2 - date1) / (1000 * 60 * 60 * 24);
```

### Common Mistakes

- Using `==` with NaN — always use `Number.isNaN()`.
- Forgetting months are 0-indexed in `Date` constructor.
- Using floating point for money: `0.1 + 0.2 !== 0.3` — use integers (paise) or libraries.

### Interview Tips

- Explain IEEE 754 floating point limitations.
- Know string immutability — methods return new strings.
- For dates in production, mention libraries like `date-fns` or `Day.js`.

---

## 13. Error Handling

### try / catch / finally

```javascript
function parseJSON(str) {
  try {
    const data = JSON.parse(str);
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Invalid JSON:", error.message);
    } else {
      throw error; // re-throw unexpected errors
    }
    return null;
  } finally {
    console.log("parseJSON completed"); // always runs
  }
}
```

**finally** runs regardless of try/catch outcome — useful for cleanup (closing connections, hiding loaders).

### Throwing Errors

```javascript
function withdraw(balance, amount) {
  if (amount <= 0) {
    throw new RangeError("Amount must be positive");
  }
  if (amount > balance) {
    throw new Error("Insufficient balance");
  }
  return balance - amount;
}
```

### Custom Error Classes

```javascript
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

// Usage in Express-style handler
function getUser(id) {
  if (!id) throw new ValidationError("ID is required", "id");
  const user = db.find(id);
  if (!user) throw new NotFoundError("User");
  return user;
}

// Catching by type
try {
  getUser(null);
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.field, err.message);
  } else if (err instanceof AppError) {
    console.log(err.statusCode, err.code);
  } else {
    throw err;
  }
}
```

### Error Stack Traces

```javascript
try {
  throw new Error("Something broke");
} catch (e) {
  console.log(e.message); // "Something broke"
  console.log(e.stack);   // full stack trace
  console.log(e.name);    // "Error"
}
```

### Common Mistakes

- Empty catch blocks that swallow errors silently.
- Catching all errors without re-throwing unknown ones.
- Using strings instead of Error objects: `throw "bad"` — loses stack trace.

### Interview Tips

- Explain difference between operational errors (expected) vs programmer errors (bugs).
- Know `Error.captureStackTrace` in Node.js for custom errors.
- Mention global handlers: `window.onerror`, `process.on('uncaughtException')`.

---

## 14. The Event Loop

### Architecture Overview

JavaScript is **single-threaded** — one call stack, one thing at a time. Non-blocking I/O is achieved via the **event loop**.

```
┌───────────────────────────┐
│         Call Stack        │  ← synchronous code executes here
└───────────────────────────┘
            ↓ ↑
┌───────────────────────────┐
│         Event Loop        │  ← checks: "Is call stack empty?"
└───────────────────────────┘
            ↓ ↑
┌───────────────────────────┐
│      Microtask Queue      │  ← Promises, queueMicrotask, MutationObserver
└───────────────────────────┘
            ↓ ↑
┌───────────────────────────┐
│      Macrotask Queue      │  ← setTimeout, setInterval, I/O, UI rendering
└───────────────────────────┘
            ↓ ↑
┌───────────────────────────┐
│        Web APIs           │  ← browser: timers, fetch, DOM events
│   (or libuv in Node.js)   │     Node: fs, network, timers
└───────────────────────────┘
```

### Execution Order

1. Run synchronous code (call stack) until empty.
2. Run **all** microtasks (Promise callbacks, `queueMicrotask`).
3. Run **one** macrotask (e.g., one `setTimeout` callback).
4. Repeat from step 2.

| Type | Examples | Priority |
|------|----------|----------|
| Synchronous | function calls, `console.log` | Immediate (call stack) |
| Microtask | `Promise.then`, `async/await`, `queueMicrotask` | After sync, before next macrotask |
| Macrotask | `setTimeout`, `setInterval`, `setImmediate` (Node), I/O | One per loop iteration |

### Node.js Event Loop Differences

Node.js has **phases** (timers → pending → idle → poll → check → close), plus:
- `process.nextTick` — runs **before** microtasks (even higher priority).
- `setImmediate` — runs in check phase, after I/O.

Priority in Node: **Call Stack → process.nextTick → Microtasks → Macrotasks**

### Prediction Examples

**Example 1 — Basics:**

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1, 4, 3, 2
```

**Example 2 — Nested promises and timeouts:**

```javascript
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve()
  .then(() => {
    console.log("promise1");
    Promise.resolve().then(() => console.log("promise2"));
  });
console.log("end");
// Output: start, end, promise1, promise2, timeout
```

**Example 3 — async/await:**

```javascript
async function foo() {
  console.log("foo start");
  await Promise.resolve();
  console.log("foo end");
}
console.log("script start");
foo();
console.log("script end");
// Output: script start, foo start, script end, foo end
// (await splits: sync part runs immediately, rest goes to microtask)
```

**Example 4 — Tricky mixed:**

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
setTimeout(() => console.log("C"), 0);
Promise.resolve().then(() => {
  console.log("D");
  setTimeout(() => console.log("E"), 0);
});
Promise.resolve().then(() => console.log("F"));
console.log("G");
// Output: A, G, D, F, B, C, E
```

**Example 5 — async function chain:**

```javascript
async function async1() {
  console.log("1");
  await async2();
  console.log("2");
}
async function async2() {
  console.log("3");
}
console.log("4");
async1();
console.log("5");
// Output: 4, 1, 3, 5, 2
```

**Example 6 — Node.js nextTick:**

```javascript
// Node.js only
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
console.log("end");
// Output: start, end, nextTick, promise, timeout
```

**Example 7 — Interview classic:**

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
Promise.resolve().then(() => console.log("promise"));
// Output: promise, 3, 3, 3
```

### Common Mistakes

- Thinking `setTimeout(fn, 0)` runs immediately — it waits for stack to clear + microtasks.
- Blocking the call stack with heavy sync code — freezes UI in browser.
- Not understanding that `await` yields to microtask queue.

### Interview Tips

- Draw the event loop diagram from memory.
- Practice 10+ prediction questions — pattern recognition is key.
- Mention `requestAnimationFrame` (browser) runs before paint, separate from macrotasks.

---

## 15. Promises

### Three States

| State | Meaning | Transition |
|-------|---------|------------|
| `pending` | Initial state | → fulfilled or rejected |
| `fulfilled` | Operation succeeded | Final |
| `rejected` | Operation failed | Final |

Once settled (fulfilled/rejected), a promise cannot change state.

### Creating Promises

```javascript
const promise = new Promise((resolve, reject) => {
  // Executor runs synchronously!
  const success = true;
  if (success) {
    resolve("Data loaded");
  } else {
    reject(new Error("Failed to load"));
  }
});

promise
  .then(value => console.log(value))
  .catch(error => console.error(error.message))
  .finally(() => console.log("Cleanup"));
```

### Chaining

```javascript
fetchUser(id)
  .then(user => fetchOrders(user.id))
  .then(orders => calculateTotal(orders))
  .then(total => console.log(`Total: ₹${total}`))
  .catch(err => console.error("Pipeline failed:", err));

// Each .then can return a value or a new Promise
// Return value → wrapped in Promise.resolve
// Thrown error → caught by next .catch
```

### Promise Static Methods

```javascript
// Promise.all — fails fast if ANY rejects
const [users, products] = await Promise.all([
  fetchUsers(),
  fetchProducts()
]);
// If one fails, entire Promise.all rejects

// Promise.allSettled — waits for ALL, never rejects
const results = await Promise.allSettled([
  fetchUsers(),
  fetchProducts()
]);
// [{ status: 'fulfilled', value: [...] }, { status: 'rejected', reason: Error }]

// Promise.race — first to settle wins
const fastest = await Promise.race([
  fetchFromServer1(),
  fetchFromServer2(),
  timeout(5000) // reject if > 5s
]);

// Promise.any — first to FULFILL wins (ES2021)
const firstSuccess = await Promise.any([
  fetchMirror1(),
  fetchMirror2()
]);
// Only rejects if ALL fail (AggregateError)
```

| Method | Resolves When | Rejects When | Use Case |
|--------|---------------|--------------|----------|
| `all` | All fulfill | Any rejects | Parallel deps (all required) |
| `allSettled` | All settle | Never | Audit/report all outcomes |
| `race` | First settles | First rejects | Timeout patterns |
| `any` | First fulfills | All reject | Fallback mirrors |

### Promise Utilities

```javascript
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Wrap callback API
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

### Common Mistakes

- Forgetting to `return` inside `.then` chain — breaks pipeline.
- Creating "promise hell" instead of chaining or using async/await.
- Not catching rejections — unhandled rejection warnings/crashes.
- Assuming `Promise.all` runs in parallel — it starts all immediately but JS is still single-threaded.

### Interview Tips

- Implement `Promise.all`, `Promise.race` from scratch.
- Explain difference between microtask (Promise) and macrotask (setTimeout).
- Convert callback-based API to Promise (promisify pattern).

---

## 16. async/await

### Basics

`async/await` is syntactic sugar over Promises.

```javascript
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return data;
}

// async function ALWAYS returns a Promise
fetchUserData(1).then(data => console.log(data));
```

### Error Handling

```javascript
// try/catch with async/await
async function loadData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error("Failed:", error.message);
    return null;
  }
}

// .catch on the returned promise
async function riskyOperation() {
  const result = await mightFail();
  return result;
}
riskyOperation().catch(err => console.error(err));
```

### Sequential vs Parallel

```javascript
// ❌ Sequential — slow (one after another)
async function sequential() {
  const user = await fetchUser();     // 200ms
  const orders = await fetchOrders(); // 200ms
  const products = await fetchProducts(); // 200ms
  // Total: ~600ms
}

// ✅ Parallel — fast (all at once)
async function parallel() {
  const [user, orders, products] = await Promise.all([
    fetchUser(),      // \
    fetchOrders(),    //  all start together → ~200ms total
    fetchProducts()   // /
  ]);
}

// Mixed — parallel where independent, sequential where dependent
async function mixed(userId) {
  const user = await fetchUser(userId);        // need user first
  const [orders, wishlist] = await Promise.all([
    fetchOrders(user.id),
    fetchWishlist(user.id)
  ]);
  return { user, orders, wishlist };
}
```

### Top-Level await (ES Modules)

```javascript
// module.js
const config = await fetchConfig();
export { config };
```

### Common Mistakes

```javascript
// Mistake: forEach with async — doesn't await!
async function processItems(items) {
  items.forEach(async (item) => {
    await processItem(item); // forEach doesn't wait!
  });
  console.log("Done"); // prints BEFORE items processed
}

// Fix: for...of or Promise.all
async function processItemsFixed(items) {
  for (const item of items) {
    await processItem(item); // sequential
  }
  // OR
  await Promise.all(items.map(item => processItem(item))); // parallel
}

// Mistake: unnecessary async
async function getValue() {
  return 42; // just return 42, no need for async
}
```

### Interview Tips

- Explain that `await` pauses async function, not the main thread.
- Compare async/await readability vs Promise chains.
- Implement async retry logic with exponential backoff.

---

## 17. Fetch API & JSON

### Fetch Basics

```javascript
// GET request
async function getUsers() {
  const response = await fetch("https://api.example.com/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token123"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

// POST request
async function createUser(userData) {
  const response = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  return response.json();
}

// PUT, PATCH, DELETE — same pattern, change method
```

### Response Object

```javascript
const response = await fetch(url);

response.status;       // 200, 404, 500
response.ok;           // true if 200-299
response.statusText;   // "OK"
response.headers;      // Headers object
response.url;          // final URL (after redirects)

const text = await response.text();   // raw text
const json = await response.json();   // parsed JSON
const blob = await response.blob();   // binary data
```

### JSON Methods

```javascript
const obj = { name: "Tanvi", skills: ["JS", "React", "Node"] };

// Serialize
const jsonString = JSON.stringify(obj);
// '{"name":"Tanvi","skills":["JS","React","Node"]}'

JSON.stringify(obj, null, 2); // pretty print

// Deserialize
const parsed = JSON.parse(jsonString);

// JSON limitations
JSON.stringify({ date: new Date() });
// date becomes ISO string, not Date object on parse

JSON.stringify({ fn: () => {} });
// functions, undefined, symbols are omitted
```

### Fetch with AbortController (Timeout/Cancel)

```javascript
async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}
```

### Common Mistakes

- Not checking `response.ok` — fetch doesn't reject on 404/500.
- Calling `response.json()` twice — body can only be consumed once.
- Not handling network errors (offline, CORS) separately from HTTP errors.

### Interview Tips

- Explain CORS at high level (browser security, preflight OPTIONS).
- Compare fetch vs axios (interceptors, auto JSON, timeout).
- Know JSON.parse can throw — always wrap in try/catch.

---

## 18. ES Modules vs CommonJS

### CommonJS (Node.js traditional)

```javascript
// math.js
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }

module.exports = { add, subtract };
// OR
exports.add = add;

// app.js
const { add, subtract } = require('./math');
const math = require('./math'); // whole module object

// Dynamic, synchronous loading
const config = require(`./config/${env}.js`);
```

### ES Modules (Modern standard)

```javascript
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export default class Calculator { /* ... */ }

// app.js
import Calculator, { add, subtract } from './math.js';
import * as math from './math.js';

// Re-export
export { add } from './math.js';

// Dynamic import (returns Promise)
const module = await import('./math.js');
```

### Key Differences

| Feature | CommonJS | ES Modules |
|---------|----------|------------|
| Syntax | `require` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous |
| Tree shaking | Limited | Yes (static analysis) |
| `this` at top level | `module.exports` | `undefined` |
| File extension | `.js` (implicit) | `.js` or `.mjs` (explicit in Node) |
| Browser support | Needs bundler | Native in modern browsers |
| `__dirname` | Available | Not available (use `import.meta.url`) |

### Node.js ESM Setup

```json
// package.json
{
  "type": "module"
}
```

```javascript
// __dirname equivalent in ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### Common Mistakes

- Mixing `require` and `import` in same file without understanding interop.
- Forgetting `.js` extension in Node ESM imports.
- Using named import for default export: `import { X }` vs `import X`.

### Interview Tips

- Explain why ESM enables tree shaking (static structure).
- Know `"type": "module"` vs `.mjs` extension.
- Mention bundlers (Webpack, Vite, esbuild) bridge browser + Node.

---

## 19. Utility Patterns: Debounce, Throttle, Deep Clone, Curry

### Debounce

Delays execution until after `wait` ms have passed since the **last** call. Use for: search input, resize handlers.

```javascript
function debounce(fn, wait, immediate = false) {
  let timeoutId = null;

  return function debounced(...args) {
    const context = this;
    const callNow = immediate && !timeoutId;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) fn.apply(context, args);
    }, wait);

    if (callNow) fn.apply(context, args);
  };
}

// Usage
const searchAPI = debounce((query) => {
  console.log("Searching:", query);
}, 300);

// HTML: <input oninput="searchAPI(this.value)" />
// User types "react" → only one API call 300ms after last keystroke
```

### Throttle

Ensures function runs at most once every `limit` ms. Use for: scroll events, mouse move, button spam prevention.

```javascript
function throttle(fn, limit) {
  let inThrottle = false;
  let lastArgs = null;
  let lastContext = null;

  return function throttled(...args) {
    const context = this;

    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(lastContext, lastArgs);
          lastArgs = null;
          lastContext = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastContext = context;
    }
  };
}

// Usage
const handleScroll = throttle(() => {
  console.log("Scroll position:", window.scrollY);
}, 200);
window.addEventListener("scroll", handleScroll);
```

### Deep Clone

```javascript
function deepClone(value, seen = new WeakMap()) {
  // Primitives and functions
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle circular references
  if (seen.has(value)) {
    return seen.get(value);
  }

  // Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // Map
  if (value instanceof Map) {
    const cloned = new Map();
    seen.set(value, cloned);
    value.forEach((v, k) => cloned.set(deepClone(k, seen), deepClone(v, seen)));
    return cloned;
  }

  // Set
  if (value instanceof Set) {
    const cloned = new Set();
    seen.set(value, cloned);
    value.forEach(v => cloned.add(deepClone(v, seen)));
    return cloned;
  }

  // Array or Object
  const cloned = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, cloned);

  for (const key of Reflect.ownKeys(value)) {
    cloned[key] = deepClone(value[key], seen);
  }

  return cloned;
}

// Usage
const original = { a: 1, b: { c: 2 }, d: [3, { e: 4 }] };
original.self = original; // circular
const copy = deepClone(original);
copy.b.c = 99;
console.log(original.b.c); // 2 — unchanged

// Modern alternative (no functions, dates, circular refs):
// structuredClone(original) — built-in, ES2022
```

### Curry

Transforms a function with N arguments into N functions each taking one argument (or partial application).

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
}

// Usage
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
curriedAdd(1)(2)(3);    // 6
curriedAdd(1, 2)(3);    // 6
curriedAdd(1)(2, 3);    // 6

// Practical example — reusable validators
const makeValidator = curry((rule, field, value) => rule(value) ? null : `${field} invalid`);
const minLength = (n) => (str) => str.length >= n;
const validatePassword = makeValidator(minLength(8));
validatePassword("password", "123"); // "password invalid"
validatePassword("password", "secure123"); // null
```

### Debounce vs Throttle Summary

| Pattern | Behavior | Analogy | Use Case |
|---------|----------|---------|----------|
| Debounce | Wait for pause | Elevator door waits for last person | Search autocomplete |
| Throttle | Max once per interval | ATM allows one txn per 5 sec | Scroll position tracker |

### Common Mistakes

- Using debounce for scroll (misses events) — use throttle.
- Using throttle for search input (fires too often) — use debounce.
- Deep clone with `JSON.parse(JSON.stringify())` — loses Date, Function, undefined, handles no circular refs.

### Interview Tips

- Implement all four from scratch in 20 minutes total — common live coding task.
- Mention `structuredClone` and lodash alternatives in production.
- Explain curry's role in functional programming and partial application.

---

## 20. Interview Question Bank

### Q1: What is the output?

```javascript
console.log(typeof typeof 1);
```
**Answer:** `"string"`. `typeof 1` returns `"number"`, and `typeof "number"` returns `"string"`.

---

### Q2: Explain closure and fix this code

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), i * 1000);
}
```
**Answer:** Prints `5` five times at intervals. `var` is function-scoped, all closures share same `i`. Fix: use `let i` (block-scoped) or IIFE `(function(j) { setTimeout(..., j) })(i)`.

---

### Q3: What is the output?

```javascript
const obj = {
  name: "JS",
  greet: function() { console.log(this.name); },
  arrowGreet: () => { console.log(this.name); }
};
obj.greet();
obj.arrowGreet();
const fn = obj.greet;
fn();
```
**Answer:** `"JS"`, `undefined`, `undefined`. Regular function gets `obj` as `this`; arrow inherits lexical `this` (global/module); detached method loses binding.

---

### Q4: Implement Array.prototype.flat

```javascript
function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flat(item, depth - 1) : item);
  }, []);
}
```

---

### Q5: Event loop — predict output

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```
**Answer:** `1, 4, 3, 2`. Sync first, then microtasks, then macrotasks.

---

### Q6: Difference between null and undefined?

**Answer:**
| | `undefined` | `null` |
|---|-------------|--------|
| Meaning | Variable declared but not assigned | Intentional absence of value |
| typeof | `"undefined"` | `"object"` (bug) |
| JSON | Omitted | Preserved as `null` |
| Default | Function params without args, missing object keys | Explicitly set by developer |

---

### Q7: What is prototypal inheritance?

**Answer:** Objects inherit directly from other objects via the prototype chain (`[[Prototype]]`). When a property isn't found on the object, JS walks up the chain until `null`. ES6 classes are syntactic sugar over this mechanism. `Object.create(proto)` sets prototype explicitly.

---

### Q8: Implement Promise.all

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be array"));
    }
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}
```

---

### Q9: What is the difference between `==` and `===`?

**Answer:** `==` performs type coercion before comparison (`"5" == 5` is true). `===` checks strict equality without coercion (`"5" === 5` is false). Always prefer `===` except for null checks (`value == null` catches both null and undefined).

---

### Q10: Explain event delegation

**Answer:** Attach one event listener to a parent element instead of many on children. Events bubble up; use `event.target` to identify which child was clicked. Benefits: fewer listeners, works for dynamically added elements, better memory usage.

```javascript
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    console.log("Clicked:", e.target.textContent);
  }
});
```

---

### Q11: What are JavaScript memory leaks and common causes?

**Answer:** Memory that's no longer needed but not garbage collected.
1. **Global variables** — accidental globals without `var`/`let`/`const`.
2. **Forgotten timers** — `setInterval` never cleared.
3. **Closures** — holding references to large objects.
4. **Detached DOM nodes** — removed from DOM but referenced in JS.
5. **Event listeners** — not removed when component unmounts.

---

### Q12: Implement bind from scratch

```javascript
Function.prototype.myBind = function(context, ...boundArgs) {
  const fn = this;
  return function(...callArgs) {
    // Support `new` — if called with new, ignore context override
    if (new.target) return new fn(...boundArgs, ...callArgs);
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
};
```

---

### Q13: Difference between microtask and macrotask?

**Answer:** Microtasks (Promises, queueMicrotask) run after current script ends, before next render/macrotask. Macrotasks (setTimeout, setInterval, I/O) run one per event loop tick. Microtasks can starve macrotasks if chained infinitely.

---

### Q14: What is hoisting?

**Answer:** During compilation phase, JS moves variable and function declarations to top of scope. `var` declarations are hoisted and initialized as `undefined`. `let`/`const` are hoisted but not initialized (TDZ). Function declarations are fully hoisted (can call before line). Function expressions follow variable hoisting rules.

---

### Q15: How would you flatten a deeply nested array `[1, [2, [3, [4]]]]`?

**Answer:**

```javascript
// Recursive
function flatten(arr) {
  return arr.reduce((acc, val) =>
    acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}

// Iterative with stack
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) stack.push(...next);
    else result.push(next);
  }
  return result.reverse();
}

// ES2019+
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]
```

---

## 21. Where to Practice

### Official Documentation

| Resource | URL | Best For |
|----------|-----|----------|
| MDN Web Docs | [https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Authoritative reference, every API |
| ECMAScript Spec | [https://tc39.es/ecma262/](https://tc39.es/ecma262/) | Deep spec reading (advanced) |

### Structured Learning

| Resource | URL | Best For |
|----------|-----|----------|
| JavaScript.info | [https://javascript.info/](https://javascript.info/) | Best free structured tutorial, modern ES6+ |
| freeCodeCamp JS | [https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/) | Free certification, hands-on exercises |
| Eloquent JavaScript | [https://eloquentjavascript.net/](https://eloquentjavascript.net/) | Deep conceptual book with exercises |

### DSA & Interview Practice

| Resource | URL | Best For |
|----------|-----|----------|
| LeetCode (JS) | [https://leetcode.com/problemset/javascript/](https://leetcode.com/problemset/javascript/) | Interview DSA in JavaScript |
| HackerRank JS | [https://www.hackerrank.com/domains/tutorials/10-days-of-javascript](https://www.hackerrank.com/domains/tutorials/10-days-of-javascript) | 10-day JS challenge |
| Codewars | [https://www.codewars.com/?language=javascript](https://www.codewars.com/?language=javascript) | Kata-style JS problems |
| GreatFrontEnd | [https://www.greatfrontend.com/questions/javascript](https://www.greatfrontend.com/questions/javascript) | Frontend-specific JS questions |

### Event Loop Visualizers

| Resource | URL |
|----------|-----|
| Loupe (Philip Roberts) | [http://latentflip.com/loupe/](http://latentflip.com/loupe/) |
| JS Event Loop Visualizer | [https://www.jsv9000.app/](https://www.jsv9000.app/) |

### Weekly Practice Plan (Post-Bootcamp)

| Day | Activity | Time |
|-----|----------|------|
| Mon | javascript.info — 1 chapter + notes | 1.5 hr |
| Tue | 3 LeetCode Easy/Medium (JS) | 1.5 hr |
| Wed | Re-implement 1 utility (debounce, curry, etc.) | 1 hr |
| Thu | 5 event loop prediction problems | 45 min |
| Fri | 2 interview questions aloud (Section 20) | 1 hr |
| Sat | Build mini project (vanilla JS) | 3 hr |
| Sun | Review weak areas from week | 1 hr |

---

## Quick Reference Cheat Sheet

```
TRUTHY/FALSY:  falsy = false, 0, -0, 0n, "", null, undefined, NaN

SCOPE:         var → function | let/const → block

THIS:          default < implicit < explicit < new

EVENT LOOP:    sync → microtasks (all) → macrotask (one) → repeat

PROMISES:      pending → fulfilled | rejected (immutable once settled)

ASYNC:         async fn returns Promise; await pauses fn, not thread

CLONE:         shallow = spread/assign | deep = structuredClone/custom

EQUALITY:      prefer === | Object.is for NaN | == null for null+undefined
```

---

> **Next Module:** [02-DOM & Browser APIs](./02-dom-browser.md) — Document manipulation, events, storage, and performance.
>
> **Remember:** JavaScript mastery for 30 LPA roles isn't about memorizing syntax — it's about understanding *execution*, *memory*, and *async behavior*. Code every example. Predict before you run. Explain before you move on.

*Last updated: July 2026 | MERN Mastery Bootcamp — Module 01*
