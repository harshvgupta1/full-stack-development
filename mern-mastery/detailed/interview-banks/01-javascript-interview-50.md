# Product Company Interview Bank — JavaScript (100 Questions)

> **Target companies:** Google, Meta, Microsoft, Amazon, Adobe, Atlassian, Uber, Flipkart, Salesforce, Stripe
> **Rule:** Full terms only — no unexplained abbreviations. Write for absolute beginners who know nothing.

---

### Question 1: What is hoisting in JavaScript, and how does it behave for `var`, `let`, and `const`?
**Answer:** Hoisting is JavaScript's behavior of moving declarations to the top of their scope during compilation, before code runs. Variables declared with `var` are hoisted and initialized as `undefined`, so you can reference them before the assignment line (though the value is `undefined`). Variables declared with `let` and `const` are also hoisted, but they stay in the Temporal Dead Zone until their declaration line runs — accessing them before that throws a `ReferenceError`. At companies like Google and Amazon, interviewers often follow up by asking you to predict output of a snippet mixing `var` and function declarations.

### Question 2: What is the Temporal Dead Zone, and why does it exist?
**Answer:** The Temporal Dead Zone is the period between the start of a scope and the line where a `let` or `const` variable is declared. During this time, the variable name exists in the scope but cannot be accessed — doing so throws a `ReferenceError`. It exists to catch bugs from using variables before they are initialized, which `var` silently allowed. Interviewers at Meta and Stripe often ask candidates to explain why `typeof undeclaredVar` returns `"undefined"` but `typeof letVarBeforeDeclaration` throws an error.

### Question 3: What will this code print, and why?
```javascript
console.log(a);
var a = 10;
console.log(a);
```
**Answer:** It prints `undefined`, then `10`. The `var a` declaration is hoisted to the top of the scope and initialized to `undefined`, so the first `console.log` sees `undefined`. After `a = 10` runs, the second log prints `10`. This pattern is a classic hoisting trap asked at Adobe and Flipkart to test whether you understand declaration versus assignment.

### Question 4: What is a closure in JavaScript?
**Answer:** A closure is when a function remembers and can access variables from the scope where it was created, even after that outer scope has finished running. The inner function "closes over" those variables, keeping them alive in memory. Closures power patterns like private state, callbacks, and factory functions. At Uber and Salesforce, follow-up questions often ask you to use a closure to implement a counter or memoization cache.

### Question 5: What will this code output?
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
```
**Answer:** It prints `3` three times. Because `var` is function-scoped (not block-scoped), there is only one shared `i`. By the time the timeouts run, the loop has finished and `i` is `3`. This is one of the most common JavaScript interview questions at Amazon and Microsoft; the fix is to use `let` (which creates a new binding per iteration) or an immediately invoked function expression to capture each value.

### Question 6: Fix the loop so it prints 0, 1, 2 using `var`.
**Answer:** Wrap the timeout callback in an immediately invoked function expression that captures the current index:
```javascript
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j); // prints 0, then 1, then 2
    }, 100);
  })(i);
}
```
Each immediately invoked function expression gets its own copy of `j` at the time the loop iteration runs. Interviewers at Google may also accept `let` as the modern answer and ask you to compare both approaches.

### Question 7: What does the `this` keyword refer to in JavaScript?
**Answer:** `this` refers to the object that is the current execution context of a function — essentially, "who called this function." For a regular function called as `obj.method()`, `this` is `obj`. For a standalone function call, `this` is `undefined` in strict mode or the global object (`window` in browsers) in non-strict mode. Arrow functions do not have their own `this`; they inherit `this` from the enclosing scope. Product companies like Atlassian frequently test `this` binding with `call`, `apply`, and `bind`.

### Question 8: What will this code print?
```javascript
const obj = {
  name: "Stripe",
  greet: function () {
    console.log(this.name);
  },
  greetArrow: () => {
    console.log(this.name);
  }
};
obj.greet();
obj.greetArrow();
```
**Answer:** `greet()` prints `"Stripe"` because `this` inside a regular method refers to `obj`. `greetArrow()` prints `undefined` (or the global name if one exists) because arrow functions inherit `this` from the outer lexical scope — here, the module or global scope, not `obj`. This distinction is heavily tested at Meta and Stripe during frontend interviews.

### Question 9: Explain the difference between `call`, `apply`, and `bind`.
**Answer:** All three methods let you explicitly set the `this` value of a function. `call(thisArg, arg1, arg2, ...)` invokes the function immediately with individual arguments. `apply(thisArg, [arg1, arg2, ...])` invokes immediately but accepts arguments as an array. `bind(thisArg, arg1, ...)` returns a new function with `this` permanently bound; it does not invoke immediately. At Amazon and Flipkart, a common follow-up is: "Implement your own version of `bind`."

### Question 10: What is prototypal inheritance in JavaScript?
**Answer:** In JavaScript, objects can inherit properties and methods from other objects through a hidden link called the prototype. Every object has an internal `[[Prototype]]` (accessible via `Object.getPrototypeOf` or the deprecated `__proto__`). When you access a property, JavaScript looks on the object first, then walks up the prototype chain until it finds the property or reaches `null`. Classes in modern JavaScript are syntactic sugar over this prototype system. Google and Microsoft often ask candidates to explain how inheritance works without using the `class` keyword.

### Question 11: What is the difference between `__proto__` and `prototype`?
**Answer:** `prototype` is a property on constructor functions (like `function Person() {}`) — it is the object that will become the `[[Prototype]]` of instances created with `new Person()`. `__proto__` (deprecated; use `Object.getPrototypeOf` instead) is the actual prototype link on any object instance pointing to its parent. In short: `prototype` is on functions; the instance's internal prototype points to that object. This distinction appears in debugging rounds at Adobe and Atlassian.

### Question 12: What will this code output?
```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name + " makes a sound";
};
const dog = new Animal("Rex");
console.log(dog.speak());
console.log(dog.hasOwnProperty("speak"));
console.log("speak" in dog);
```
**Answer:** It prints `"Rex makes a sound"`, then `false`, then `true`. `speak` lives on `Animal.prototype`, not directly on `dog`, so `hasOwnProperty("speak")` is `false`. The `in` operator checks the entire prototype chain, so `"speak" in dog` is `true`. This tests prototype chain lookup, a staple at Flipkart and Uber backend-to-fullstack interviews.

### Question 13: Explain the JavaScript event loop in simple terms.
**Answer:** JavaScript is single-threaded — it runs one piece of code at a time. The event loop is the mechanism that lets JavaScript handle asynchronous work without blocking. When async tasks finish (timers, network responses, user events), their callbacks go into task queues. The event loop repeatedly checks: "Is the call stack empty? If yes, pull the next task from the queue and run it." Microtasks (like Promise callbacks) run before macrotasks (like `setTimeout`). Every major product company — Google, Meta, Amazon — asks event loop questions.

### Question 14: In what order will this code log?
```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```
**Answer:** Order: `1`, `4`, `3`, `2`. Synchronous code runs first (`1`, `4`). Then the microtask queue drains — the Promise `.then` callback logs `3`. Finally the macrotask queue runs — `setTimeout` logs `2`, even with zero delay. Interviewers at Stripe and Salesforce use this exact pattern to test microtask versus macrotask priority.

### Question 15: What is the difference between a microtask and a macrotask?
**Answer:** Microtasks are short, high-priority async callbacks scheduled by Promises, `queueMicrotask`, `MutationObserver`, and `async/await` continuations. Macrotasks (also called tasks) come from `setTimeout`, `setInterval`, input events, and network callbacks. After each macrotask completes, the engine runs all pending microtasks before picking the next macrotask. Understanding this ordering is critical for debugging race conditions in production code at companies like Uber and Atlassian.

### Question 16: What is a Promise in JavaScript?
**Answer:** A Promise is an object representing the eventual result of an asynchronous operation — either success (fulfilled) or failure (rejected). It has three states: pending, fulfilled, and rejected. Once settled, a Promise cannot change state. You attach handlers with `.then()` for success, `.catch()` for errors, and `.finally()` for cleanup. Promises replaced callback pyramids and are foundational to modern async code at every company on this list.

### Question 17: Implement a function `delay(ms)` that returns a Promise resolving after `ms` milliseconds.
**Answer:**
```javascript
function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}
// Usage: await delay(1000); // waits 1 second
```
This wraps `setTimeout` in a Promise so it works with `async/await`. At Amazon and Microsoft, interviewers often extend this to: "Implement `Promise.all`" or "Retry a fetch three times with delay between attempts."

### Question 18: What does `async/await` do, and how is it related to Promises?
**Answer:** `async/await` is syntactic sugar built on Promises that makes asynchronous code look and read like synchronous code. An `async` function always returns a Promise. The `await` keyword pauses execution inside an `async` function until the Promise settles, then returns its value. Under the hood, `await` is equivalent to `.then()`. Error handling uses `try/catch` instead of `.catch()`. This pattern is standard in React and Node.js codebases at Meta, Google, and Adobe.

### Question 19: What will this async function return?
```javascript
async function fetchData() {
  return 42;
}
const result = fetchData();
console.log(result);
```
**Answer:** It logs `Promise { 42 }` (or similar Promise object), not `42`. An `async` function always wraps its return value in a resolved Promise. To get `42`, you must use `await fetchData()` inside another `async` function or call `fetchData().then(console.log)`. This catches many candidates at Flipkart and Stripe who assume `async` changes the return type to the raw value.

### Question 20: What is type coercion in JavaScript?
**Answer:** Type coercion is JavaScript's automatic conversion of a value from one type to another during operations. It happens with the abstract equality operator (`==`), string concatenation with `+`, and boolean contexts (`if` conditions). For example, `"5" + 1` becomes `"51"` (string concatenation), but `"5" - 1` becomes `4` (numeric subtraction forces conversion). Explicit conversion uses functions like `Number()`, `String()`, and `Boolean()`. Interviewers at Google and Amazon love asking candidates to predict coercion output.

### Question 21: What are the results of these comparisons?
```javascript
console.log([] == false);
console.log([] == ![]);
console.log(null == undefined);
console.log(null === undefined);
```
**Answer:** `[] == false` is `true` — the empty array coerces to `""`, then to `0`; `false` coerces to `0`. `[] == ![]` is `true` — `![]` is `false` (arrays are truthy, so negation gives `false`), then same coercion chain leads to `0 == 0`. `null == undefined` is `true` (special rule in the abstract equality spec). `null === undefined` is `false` (strict equality checks type and value; they are different types). These "trick" questions appear in Adobe and Atlassian screening rounds.

### Question 22: Why should you prefer `===` over `==` in production code?
**Answer:** The strict equality operator (`===`) compares both value and type without coercion, making behavior predictable and reducing hidden bugs. The abstract equality operator (`==`) performs type coercion, which can produce surprising results (like `0 == false` being `true`). Using `===` everywhere except rare null-checks (`value == null` catches both `null` and `undefined`) is a best practice enforced by linters at Stripe, Salesforce, and most product companies.

### Question 23: What are arrow functions, and when should you NOT use them?
**Answer:** Arrow functions (introduced in ECMAScript 2015) provide shorter syntax and lexically bind `this`, `arguments`, `super`, and `new.target` from the enclosing scope. Do not use arrow functions as object methods when you need dynamic `this` (use regular functions). Do not use them as constructors (`new arrowFn()` throws). Do not use them where you need the `arguments` object. At Meta and Uber, interviewers ask when arrow functions cause bugs in React class components versus functional components.

### Question 24: Explain destructuring assignment with an example.
**Answer:** Destructuring lets you unpack values from arrays or properties from objects into distinct variables in one statement.
```javascript
const user = { name: "Priya", role: "engineer", level: 5 };
const { name, role } = user; // name = "Priya", role = "engineer"

const scores = [90, 85, 78];
const [first, , third] = scores; // first = 90, third = 78 (skip second)
```
It also supports defaults, renaming, and nested destructuring. This ECMAScript 2015 feature is used daily in React props and API response handling at every target company.

### Question 25: What is the spread operator, and how does it differ from rest parameters?
**Answer:** The spread operator (`...`) expands an iterable into individual elements. Rest parameters use the same syntax but collect remaining elements into an array. Spread: `const merged = [...arr1, ...arr2]` copies and combines arrays. Rest: `function sum(first, ...rest) { return rest.reduce((a, b) => a + b, first); }` gathers extra arguments. Both were added in ECMAScript 2015. Amazon and Microsoft frequently ask candidates to clone objects or merge configurations using spread.

### Question 26: What are template literals, and why are they better than string concatenation?
**Answer:** Template literals use backticks (`` ` ``) and allow embedded expressions with `${expression}`, multiline strings without escape characters, and tagged templates for custom processing. Example: `` `Hello, ${user.name}! You have ${count} messages.` ``. They are more readable and less error-prone than `"Hello, " + user.name + "!"`. Every modern JavaScript codebase at Google, Adobe, and Flipkart uses template literals as the default for string building.

### Question 27: What is the difference between `map`, `filter`, and `reduce`?
**Answer:** All three are array methods that take a callback and do not mutate the original array. `map` transforms each element and returns a new array of the same length. `filter` returns a new array containing only elements that pass a test. `reduce` accumulates all elements into a single value (sum, object, max, etc.). Example: `[1,2,3].map(x => x * 2)` → `[2,4,6]`; `.filter(x => x > 1)` → `[2,3]`; `.reduce((sum, x) => sum + x, 0)` → `6`. These are asked in almost every JavaScript interview round.

### Question 28: Implement a function that flattens a nested array one level deep without using `.flat()`.
**Answer:**
```javascript
function flattenOneLevel(arr) {
  return arr.reduce(function (acc, item) {
    return acc.concat(Array.isArray(item) ? item : [item]);
  }, []);
}
// flattenOneLevel([1, [2, 3], 4]) → [1, 2, 3, 4]
```
This uses `reduce` and `concat` to merge sub-arrays. At Google and Uber, follow-ups include: "Flatten to any depth recursively" or "What is the linear time complexity of your solution?" — meaning the runtime grows proportionally with the number of elements.

### Question 29: What is `Set` and when would you use it over an array?
**Answer:** A `Set` is a collection of unique values — adding a duplicate has no effect. Lookups, additions, and deletions are fast (average constant time). Use a `Set` when you need uniqueness (deduplication, tracking visited nodes in a graph) or fast membership checks. Use an array when order matters for repeated elements or you need index-based access. At Stripe and Salesforce, a common question is: "Remove duplicates from an array" — `[...new Set(arr)]` is the idiomatic one-liner.

### Question 30: What is a `Map` and how is it different from a plain object?
**Answer:** A `Map` stores key-value pairs where keys can be any type (objects, functions, primitives), not just strings or symbols. It maintains insertion order, has a `.size` property, and performs better for frequent additions and deletions. Plain objects are better for fixed-shape records with string keys and JSON serialization. Atlassian and Amazon interviewers ask when you would choose `Map` over `{}` — common answers include caching with object keys or counting frequencies.

### Question 31: What is debouncing, and implement a debounce function.
**Answer:** Debouncing ensures a function runs only after a pause in calls — useful for search inputs, resize handlers, and auto-save. If the user types rapidly, the function waits until they stop for a specified delay.
```javascript
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      fn.apply(this, args);
    }, delay);
  };
}
```
Google and Adobe frontend interviews almost always include debounce or throttle implementation questions.

### Question 32: What is throttling, and how does it differ from debouncing?
**Answer:** Throttling guarantees a function runs at most once per time interval, regardless of how many times it is triggered. Debouncing waits for a pause; throttling enforces a regular cadence. Use throttle for scroll events, mouse movement tracking, or rate-limiting API calls. Use debounce for search-as-you-type or form validation after the user stops typing. At Uber and Flipkart, interviewers ask you to choose between the two for a given user interface scenario and justify your choice.

### Question 33: Implement a throttle function.
**Answer:**
```javascript
function throttle(fn, interval) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```
This version fires immediately on the first call, then ignores calls until the interval passes. A follow-up at Meta might ask for a trailing-edge throttle that also fires once after the last event in a burst.

### Question 34: What is memoization, and implement a basic memoize function?
**Answer:** Memoization caches the results of expensive function calls so repeated calls with the same arguments return the cached value instantly.
```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```
This pattern is used in React (`useMemo`), dynamic programming, and data-fetching layers. Google and Amazon ask candidates to discuss cache invalidation and memory trade-offs as follow-ups.

### Question 35: How does garbage collection work in JavaScript?
**Answer:** JavaScript engines automatically reclaim memory that is no longer reachable. The most common algorithm is mark-and-sweep: starting from roots (global object, call stack references), the engine marks all reachable objects, then sweeps (frees) everything unmarked. Objects become unreachable when no variable or closure references them. Memory leaks happen when you accidentally keep references — common causes include forgotten event listeners, global variables, and closures holding large objects. Microsoft and Salesforce system design rounds touch on memory when discussing long-lived single-page applications.

### Question 36: What causes a memory leak in JavaScript, and give an example?
**Answer:** A memory leak occurs when memory that is no longer needed stays allocated because something still references it. Example: attaching an event listener inside a component but never removing it when the component is destroyed — the listener closure keeps the entire component state alive. Another example: storing data in a global array that grows forever (like an unbounded log cache). At Atlassian and Adobe, interviewers ask how you would detect leaks using browser DevTools Memory tab and heap snapshots.

### Question 37: What is the difference between shallow copy and deep copy?
**Answer:** A shallow copy creates a new object or array but copies nested references — changes to nested objects affect both copies. A deep copy recursively clones everything, producing fully independent data. Shallow: `const copy = { ...original }` or `const copy = Object.assign({}, original)`. Deep: `structuredClone(original)` (modern browsers and Node.js) or `JSON.parse(JSON.stringify(original))` (limited — no functions, dates, or `undefined`). Amazon and Flipkart ask this when discussing immutable state patterns in React or Redux.

### Question 38: What will this code output?
```javascript
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 99;
console.log(original.nested.b);
```
**Answer:** It prints `99`. The spread operator creates a shallow copy — `shallow` is a new top-level object, but `shallow.nested` points to the same inner object as `original.nested`. Mutating the nested property affects both. This is a frequent debugging question at Stripe and Meta when discussing React state updates — always copy nested objects when immutability is required.

### Question 39: What is strict mode (`"use strict"`), and what does it change?
**Answer:** Strict mode is an opt-in variant of JavaScript that catches common mistakes and disables unsafe features. It is activated with `"use strict"` at the top of a file or function. Changes include: assigning to undeclared variables throws `ReferenceError`; duplicate parameter names are syntax errors; `this` is `undefined` in standalone functions (not the global object); deleting non-configurable properties throws. All ECMAScript modules are strict by default. Google and Microsoft expect candidates to write interview code in strict mode.

### Question 40: What are JavaScript modules (`import` / `export`), and how do they differ from script tags?
**Answer:** ECMAScript modules (`import` / `export`) let you split code into reusable files with explicit dependencies. Modules are automatically in strict mode, have their own scope (no global pollution), and support static analysis for tree-shaking (removing unused code at build time). Classic script tags share the global scope and load in order. Dynamic `import()` returns a Promise for lazy loading. Every modern frontend at Meta, Google, and Adobe uses module bundlers (Webpack, Vite) built on this system.

### Question 41: What is event delegation, and why is it useful?
**Answer:** Event delegation attaches a single event listener to a parent element instead of one listener per child. When an event bubbles up, the handler checks `event.target` to determine which child was clicked. It is useful for dynamic lists (items added or removed after page load), better memory usage, and simpler code. Example: one `click` listener on a `<ul>` handles clicks on all `<li>` items. Flipkart and Uber product pages with long scrollable lists use this pattern extensively.

### Question 42: What is the difference between event bubbling and event capturing?
**Answer:** When an event fires on a nested element, it travels in three phases: capturing (from root down to target), target (the element itself), and bubbling (from target back up to root). By default, listeners run during the bubbling phase. You can listen during capturing by passing `{ capture: true }` as the third argument to `addEventListener`. Calling `event.stopPropagation()` prevents the event from traveling further. Adobe and Atlassian ask this when debugging click handlers on nested user interface elements.

### Question 43: Implement a function `once(fn)` that ensures `fn` runs only one time.
**Answer:**
```javascript
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}
```
The closure tracks whether the function has been called. Subsequent calls return the cached result without re-invoking. This pattern appears in initialization logic, lazy singletons, and React's `useRef`-based run-once effects. Google interviewers may ask you to implement a version that also handles arguments differently on subsequent calls.

### Question 44: What is currying in JavaScript?
**Answer:** Currying transforms a function that takes multiple arguments into a series of functions each taking one argument (or a few). Example: `const add = (a) => (b) => (c) => a + b + c; add(1)(2)(3)` returns `6`. It enables partial application — fixing some arguments to create specialized functions. Functional programming libraries and some React hooks patterns use currying. At Stripe and Salesforce, follow-ups ask you to write a generic `curry` utility function.

### Question 45: What will this Promise chain output?
```javascript
Promise.resolve(1)
  .then((val) => val + 1)
  .then((val) => { throw new Error("fail"); })
  .then((val) => console.log("success:", val))
  .catch((err) => console.log("caught:", err.message))
  .then(() => console.log("done"));
```
**Answer:** It prints `"caught: fail"`, then `"done"`. The third `.then` throws, so the next `.then` (success handler) is skipped and execution jumps to `.catch`. After catching, the chain continues — the final `.then` runs because `.catch` returns a resolved Promise. Understanding Promise chain recovery is essential for error handling in production APIs at Amazon and Microsoft.

### Question 46: Implement `Promise.all` from scratch.
**Answer:**
```javascript
function promiseAll(promises) {
  return new Promise(function (resolve, reject) {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach(function (promise, index) {
      Promise.resolve(promise)
        .then(function (value) {
          results[index] = value;
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject); // one failure rejects entire batch
    });
  });
}
```
This preserves result order regardless of completion order. Google and Meta frequently ask for this plus a discussion of `Promise.allSettled` (wait for all, never reject early) and `Promise.race`.

### Question 47: What is the difference between `null` and `undefined`?
**Answer:** `undefined` means a variable has been declared but not assigned a value, or a function returns nothing (implicit return). It is the default for missing object properties and function parameters. `null` is an intentional assignment representing "no value" or "empty." `typeof undefined` is `"undefined"`; `typeof null` is `"object"` (a long-standing language bug). Use `null` when you explicitly want to signal emptiness; `undefined` usually appears automatically. This basics question still appears at every company as a warm-up.

### Question 48: What are Symbols in JavaScript, and why were they added?
**Answer:** A Symbol is a primitive type introduced in ECMAScript 2015 that creates guaranteed-unique identifiers. Every `Symbol("desc")` is distinct, even with the same description. Symbols are used for hidden object properties (not shown in `for...in` or `Object.keys`), well-known constants like `Symbol.iterator`, and preventing naming collisions in libraries. At Google and Atlassian, this comes up when discussing iterable protocols and meta-programming in frameworks.

### Question 49: Debug this code — why does the counter always show 0?
```javascript
function Counter() {
  this.count = 0;
}
Counter.prototype.increment = () => {
  this.count++;
};
const c = new Counter();
c.increment();
console.log(c.count);
```
**Answer:** The bug is using an arrow function for `increment`. Arrow functions do not have their own `this` — `this.count++` modifies the outer scope's `this` (likely the global object or `undefined` in strict mode), not the `Counter` instance. Fix: use a regular function — `Counter.prototype.increment = function () { this.count++; };`. This is a classic debugging question at Meta, Uber, and Flipkart that combines prototypes with `this` binding.

### Question 50: You are building a search feature for a Flipkart-style e-commerce site. The user types in a search box and you call an API on each keystroke. How do you optimize this, and what JavaScript concepts apply?
**Answer:** Use debouncing to wait until the user pauses typing (for example, 300 milliseconds) before firing the API call — this reduces hundreds of requests to a few. Cancel or ignore stale responses when a newer search term is already in flight (use an `AbortController` or a request identifier check). Cache recent search results in a `Map` keyed by query string for instant repeat searches. Show a loading state while the Promise is pending. These patterns combine debouncing, Promises, `async/await`, and memory-conscious caching — exactly the kind of practical system design question asked at Flipkart, Amazon, Google, and Uber in frontend interviews.
---

## Questions 51–100 (top product companies)

### Question 51: What is the difference between shallow copy and deep copy?
**Answer:** A shallow copy (`Object.assign`, spread) copies the top level; nested objects stay shared. A deep copy duplicates the graph (`structuredClone`). Product bugs: mutating a copied cart item also mutates the original. Google and Flipkart ask you to pick the right copy for a state update.

### Question 52: Explain `map`, `filter`, and `reduce` and when reduce is the wrong tool.
**Answer:** `map` transforms 1:1, `filter` keeps some, `reduce` folds to any shape. Prefer `map`/`filter` when that is all you need — `reduce` that builds an array is harder to read. Meta FE screens often ask you to rewrite a `reduce` as `map`.

### Question 53: What is optional chaining and nullish coalescing?
**Answer:** `a?.b` short-circuits if `a` is nullish. `??` uses the right side only for `null`/`undefined` (not `0` or `""`). Amazon likes `??` vs `||` as a trap.

### Question 54: How do ES modules differ from CommonJS?
**Answer:** ES modules are static, live bindings, `import`/`export`, async in browsers. CommonJS is `require`, copy of exports, sync. Mixing them needs default-import interop. Node interviews at Uber ask about circular imports.

### Question 55: What is the event loop `requestAnimationFrame` vs `setTimeout` for animation?
**Answer:** `requestAnimationFrame` runs before the next paint (~60 Hz) and pauses in background tabs. `setTimeout(16)` drifts and wastes work off-screen. Google FE expects this for jank talk.

### Question 56: How would you implement `Promise.all` yourself?
**Answer:** Return a Promise; count completions; on any reject, reject immediately; on all fulfill, resolve the values in order. Meta and Google ask this after `Promise` basics.

### Question 57: What is a memory leak from a forgotten timer?
**Answer:** A `setInterval` closure holds DOM nodes or large arrays. Clear on unmount / route change. Chrome heap snapshots at Google FE.

### Question 58: Explain `async`/`await` error handling vs `.catch`.
**Answer:** `try/catch` around `await`. Forgotten `await` swallows errors into an unhandled rejection. Always return/await the Promise in Express. Adobe and Amazon ask this with a broken snippet.

### Question 59: What are tagged template literals used for?
**Answer:** A function receives the string parts and interpolations — `sql`...`` or `css`...``. Used in GraphQL and CSS-in-JS. Atlassian may ask how they prevent injection if misused.

### Question 60: How does `Object.freeze` differ from `const`?
**Answer:** `const` blocks reassignment of the binding, not mutation of the object. `freeze` makes own properties non-writable (shallow). Stripe and Microsoft use this for config objects.

### Question 61: What is the difference between `for...of` and `for...in`?
**Answer:** `for...in` enumerates enumerable keys (including inherited). `for...of` uses the iterator (values). Never `for...in` arrays in production. Flipkart warm-up.

### Question 62: Explain tail-call optimization — does JavaScript have it?
**Answer:** Most engines do not reliably TCO. Recursion can stack-overflow; prefer iteration or trampolines. Google may mention it to see if you claim ES6 TCO as fact.

### Question 63: How do you share data between browser tabs?
**Answer:** `localStorage` + `storage` event, `BroadcastChannel`, or a SharedWorker. Cookies work but are sent to the server. Uber FE follow-up on logout-all-tabs.

### Question 64: What is CORS and when does the browser send a preflight?
**Answer:** Cross-Origin Resource Sharing. Preflight (`OPTIONS`) for non-simple methods/headers. Server must allow origin, methods, headers. Never `Access-Control-Allow-Origin: *` with credentials. Amazon and Flipkart.

### Question 65: How would you polyfill `bind`?
**Answer:** Return a function that applies the original with a fixed `this` and prepended args, using `apply`. Classic Amazon / Flipkart coding-on-whiteboard.

### Question 66: What is the difference between `slice` and `splice`?
**Answer:** `slice` copies a range, no mutate. `splice` mutates and can insert/delete. Accidental `splice` in React state is a Meta bug question.

### Question 67: Explain the module pattern vs ES modules for privacy.
**Answer:** IIFE + closures hid privates before ES modules. Modules scope is file-private; export only the public API. Still asked at Adobe.

### Question 68: What is `queueMicrotask` vs `Promise.then`?
**Answer:** Same microtask queue. `queueMicrotask` is the primitive; `then` also creates a Promise. Order among microtasks is enqueue order. Google snippet questions.

### Question 69: How do you detect a circular reference when stringifying?
**Answer:** Keep a `WeakSet` of seen objects; skip or replace cycles. `JSON.stringify` throws on cycles. Amazon debugging.

### Question 70: What is the difference between `undefined` holes in arrays and `empty`?
**Answer:** `arr[1] = undefined` vs a hole from `delete` / sparse arrays. `map` skips holes. Microsoft likes this edge.

### Question 71: Explain `new` — what does it do step by step?
**Answer:** Create object, set prototype to `Ctor.prototype`, call Ctor with `this`, return object unless Ctor returns an object. Google prototype round.

### Question 72: What are WeakMap use cases?
**Answer:** Private fields keyed by object, DOM node metadata that should not prevent garbage collection. Atlassian / Google.

### Question 73: How does `setTimeout(fn, 0)` actually delay?
**Answer:** It waits for the current stack + all microtasks + the timer phase. Not zero milliseconds. Event-loop follow-up at Meta.

### Question 74: What is a thenable?
**Answer:** Any object with a `then` method. `Promise.resolve` will assimilate it. Used in old libraries; can be a security footgun. Rare Google.

### Question 75: How do you implement debounce with leading and trailing options?
**Answer:** Leading fires immediately then locks; trailing fires after quiet. Lodash API. Flipkart search box.

### Question 76: Explain `structuredClone` vs `JSON` clone for `Date` and `Map`.
**Answer:** `structuredClone` keeps Date and Map. JSON turns Date into a string and drops Map. Adobe / Uber.

### Question 77: What is the difference between `element.innerHTML` and `textContent`?
**Answer:** `innerHTML` parses HTML (XSS risk). `textContent` is text only. Always `textContent` for user strings. All FE security.

### Question 78: How do service workers change fetch behavior?
**Answer:** They intercept fetch, can cache-first or network-first. Used for offline and performance. Google FE / PWA talk — high level is enough.

### Question 79: What is the difference between `call` stack overflow and a memory leak?
**Answer:** Stack overflow is too-deep sync recursion. A leak is heap growth over time. Diagnose differently (stack vs heap snapshot). Google.

### Question 80: Explain `Intl` for currency and dates in an e-commerce app.
**Answer:** `Intl.NumberFormat` / `DateTimeFormat` with locale. Do not hand-roll ₹ formatting. Flipkart / Amazon India.

### Question 81: How would you sandbox user-provided HTML?
**Answer:** Do not use `innerHTML`. Use a sanitizer (DOMPurify) or render as text. CSP as defense in depth. Atlassian / Google.

### Question 82: What is the iterator protocol for a range object?
**Answer:** Implement `[Symbol.iterator]()` returning `{ next }`. Enables `for...of` and spread. Google / Atlassian.

### Question 83: Why is `typeof NaN === "number"` and how do you test NaN?
**Answer:** `Number.isNaN` (not global `isNaN` which coerces). Microsoft warm-up.

### Question 84: How do you abort multiple fetches when a component unmounts?
**Answer:** One `AbortController`; pass `signal` to all; `abort()` in cleanup. React + Node interviews.

### Question 85: What is the difference between `localStorage` and `sessionStorage`?
**Answer:** localStorage persists; sessionStorage dies with the tab. Both sync and ~5 MB. Do not store tokens. All FE.

### Question 86: Explain event capturing vs bubbling.
**Answer:** Capture root→target, then bubble target→root. `addEventListener(type, fn, true)` for capture. Delegation uses bubble. Meta / Flipkart.

### Question 87: How do you measure a function’s time complexity from a snippet?
**Answer:** Loops, nested loops, log factors from halving, extra space from arrays/maps. They want Big-O spoken, not a lecture. All DSA+JS.

### Question 88: What is `document.fragment` used for?
**Answer:** Build a subtree off-DOM, then one insert — fewer reflows. Older vanilla question; still at Adobe.

### Question 89: How does `async` change the return type of a function?
**Answer:** It always returns a Promise. `return 1` → Promise of 1. Throwing rejects. Amazon snippet.

### Question 90: What is the difference between `export default` and named exports?
**Answer:** One default per module; names are explicit and refactor-friendly. Prefer named in large apps. Atlassian.

### Question 91: How would you implement a tiny pub/sub in the browser?
**Answer:** Map of event → Set of fns; `on`/`off`/`emit`. Used for cross-widget events. Uber FE.

### Question 92: What is `performance.now` vs `Date.now`?
**Answer:** `performance.now` is monotonic high-res; `Date.now` can jump. Use performance for benchmarks. Google FE.

### Question 93: Explain same-origin policy in one minute.
**Answer:** Scheme + host + port must match to read another page’s DOM/storage. CORS and postMessage are the escapes. All security.

### Question 94: How do you prevent click-jacking?
**Answer:** CSP `frame-ancestors`, `X-Frame-Options`. Amazon / Adobe security.

### Question 95: What is a generator used for in Redux-saga or similar?
**Answer:** Pause on effects (`yield take`), testable async flows. Mention only if they use sagas. Some Adobe.

### Question 96: How do you clone a function’s behavior with a different `this`?
**Answer:** `bind`, or wrap and `apply`. Do not mutate the original. Amazon.

### Question 97: What breaks if you use `parseInt` without a radix?
**Answer:** Old engines guess octal for leading 0. Always `parseInt(s, 10)`. Microsoft.

### Question 98: How would you implement `once(fn)`?
**Answer:** A closure flag; first call runs `fn`, later calls return the first result. Closure classic at Salesforce.

### Question 99: What is the difference between `undefined` and not passing an argument?
**Answer:** Missing args are `undefined`. `fn.length` still counts declared params. Default params apply. Adobe.

### Question 100: Search-as-you-type: list every JavaScript concept you would mention.
**Answer:** Debounce, AbortController, Map cache, Promise race/ignore stale, accessibility keyboard. Flipkart / Uber / Atlassian — same as Q50 but they expect this list in 30 seconds.
