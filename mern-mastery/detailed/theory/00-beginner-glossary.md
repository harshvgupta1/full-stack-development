# Beginner Glossary — No Short Forms

> **Rule for this course:** We write the **full term** first. If a short form exists, we explain it in plain English. You do not need prior coding knowledge to read the PDFs.

---

## General programming

| Full term | Meaning in simple words |
|-----------|-------------------------|
| **Programming language** | A language humans use to give instructions to a computer (example: JavaScript). |
| **Code / source code** | The text you write that the computer runs. |
| **Variable** | A named box that stores a value (example: `let age = 25`). |
| **Function** | A reusable block of code that does one job (example: add two numbers). |
| **Loop** | Code that repeats (example: print numbers 1 to 100). |
| **Conditional / if statement** | Code that runs only when a condition is true. |
| **Operator** | A symbol that does something (`+`, `-`, `===`, `%`). |
| **Modulo operator (`%`)** | Gives the **remainder** after division. Example: `10 % 3` is `1`. |
| **Syntax** | The grammar rules of a language (where to put brackets, semicolons, etc.). |
| **Runtime** | When the program is actually **running** (not just being edited). |
| **Compile / compilation** | When the engine reads your code and prepares it before or during execution. |
| **Error** | The program stops or misbehaves because something is wrong. |
| **Bug** | A mistake in code that causes wrong behavior. |
| **Debug** | Find and fix bugs. |

---

## JavaScript-specific

| Full term | Meaning in simple words |
|-----------|-------------------------|
| **JavaScript** | The programming language used in browsers and Node.js. We do **not** write "JS" alone in beginner sections. |
| **Node.js** | Lets you run JavaScript **outside** the browser (on your computer or server). |
| **Browser** | Chrome, Firefox, Safari — where websites run. |
| **Console** | A place to see printed output (`console.log`). In Node.js, your terminal is the console. |
| **Read-Eval-Print Loop (REPL)** | Interactive mode: you type one line, it runs immediately and prints the result. Node REPL = type `node` in terminal. |
| **Hoisting** | JavaScript moves **declarations** to the top of a scope during compilation. Behavior differs for `var` vs `let`/`const`. |
| **Temporal Dead Zone** | The time **after** a block starts but **before** a `let` or `const` line runs. Using the variable then causes **ReferenceError**. We do **not** write "TDZ" alone in beginner text. |
| **ReferenceError** | Error: you used a variable that does not exist yet or is not accessible. |
| **TypeError** | Error: you used a value in an invalid way (example: call something that is not a function). |
| **Scope** | Where a variable is visible (inside a function, inside `{ }` block, or globally). |
| **Block** | Code inside `{` and `}` curly braces. |
| **Closure** | A function that **remembers** variables from the place where it was created, even after the outer function finished. |
| **`this` keyword** | A special value that depends on **how** a function was called (not where it was written). |
| **Type coercion** | JavaScript **automatically converts** types (example: number `5` becomes string `"5"` when you use `+` with a string). |
| **Strict equality (`===`)** | Compares value **and** type ( `"5" === 5` is false ). |
| **Loose equality (`==`)** | Compares with coercion ( `"5" == 5` is true ). Prefer `===`. |
| **Primitive type** | Simple single values: string, number, boolean, undefined, null, symbol, bigint. |
| **Reference type / object** | Complex values stored by reference: plain objects, arrays, functions. |
| **Array** | Ordered list of values: `[1, 2, 3]`. |
| **Object** | Collection of key–value pairs: `{ name: "Amit", age: 25 }`. |
| **Map** | Built-in structure for key–value pairs with fast lookup (`new Map()`). |
| **Set** | Built-in structure that stores **unique** values only (`new Set()`). |
| **Hash map** | Another name for using an object or Map to store values by a key for fast lookup. |
| **Callback function** | A function passed as an argument to run later. |
| **Promise** | An object that represents work that will finish **in the future** (success or failure). |
| **Async / await** | Syntax to wait for slow work (network, file) without freezing the whole program. |
| **Event loop** | How JavaScript handles many tasks on one thread (timers, network, promises). |
| **Document Object Model (DOM)** | The browser's tree of HTML elements your JavaScript can change. |
| **ECMAScript** | The official **standard/specification** for JavaScript. "ECMAScript 2015" is the same as "ES6" (year 2015 update). |
| **Mozilla Developer Network (MDN)** | Free, trusted documentation website for web technologies. |

---

## Speed of algorithms (time complexity)

We explain these in **plain English** for beginners:

| Symbol | Plain English | Example |
|--------|---------------|---------|
| **Constant time** | Same speed no matter how big the input is. | Looking up a value in a Map by key. |
| **Linear time** | Work grows in proportion to input size (100 items ≈ 100 steps). | One loop through an array. |
| **Quadratic time** | Nested loops — slow for large inputs. | Comparing every pair in an array. |
| **Logarithmic time** | Very efficient search in sorted data. | Binary search (later topic). |

*(In advanced sections you may see `O(n)` notation — it always means "linear time" as above.)*

---

## Tools and websites

| Full term | Meaning |
|-----------|---------|
| **LeetCode** | Website with coding practice problems (we write "LeetCode problem 1", not "LC 1"). |
| **Git** | Version control — saves history of your code changes. |
| **GitHub** | Website to host Git repositories online. |
| **Visual Studio Code** | Popular free code editor (we say full name or "code editor"). |
| **Terminal / command line** | Text interface where you type commands like `node file.js`. |
| **Application Programming Interface (API)** | A way for programs to talk to each other (example: fetch weather data from a server). |

---

## Web stack (later months — preview only)

| Full term | Meaning |
|-----------|---------|
| **HTML** | HyperText Markup Language — structure of web pages. |
| **CSS** | Cascading Style Sheets — styling and layout. |
| **React** | JavaScript library for building user interfaces. |
| **Express** | Node.js framework for building web servers and APIs. |
| **MongoDB** | Document database (stores JSON-like documents). |
| **PostgreSQL** | Relational database (tables with rows and columns). |
| **MySQL** | Another relational database (very common in companies). |
| **Redis** | In-memory database used mainly for **caching** and speed. |

---

*Keep this PDF open while studying Week 1. Every theory and exercise PDF links back here.*
