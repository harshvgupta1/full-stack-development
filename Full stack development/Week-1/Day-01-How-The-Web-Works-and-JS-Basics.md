# 📘 WEEK 1 — DAY 1
# How The Web Works + JavaScript Basics
### *Date: September 19, 2026 | Time Required: 2 hours*

---

> **🎯 Goal:** After today, you should be able to explain to an interviewer exactly how a webpage loads when you type a URL, what JavaScript is, where it runs, and how variables & data types work at a deep level.

---

# PART 1: HOW THE INTERNET WORKS
*Theory — 20 minutes*

---

## 1.1 What is the Internet?

**Simple Answer (for your grandma):**
The internet is a giant network of computers connected to each other across the world, sharing information.

**Interview Answer:**
The internet is a global network of interconnected computers that communicate using standardized protocols (primarily TCP/IP). It's a physical infrastructure of cables (undersea fiber optic cables, copper wires), routers, switches, and servers that enables data transfer between any two connected devices.

### Real-World Analogy 🏪
Think of the internet like the **postal system**:
- Your computer = Your house
- Server = A warehouse/shop
- IP Address = Your home address (e.g., 192.168.1.1)
- Domain Name (google.com) = The shop's name (easier to remember than the address)
- DNS = The phone directory that converts names to addresses
- HTTP = The language both sides agree to speak
- Router = The post office that routes your mail

```
YOUR COMPUTER ←→ ROUTER ←→ ISP ←→ INTERNET BACKBONE ←→ SERVER
   (Home)      (Post Office)  (Postal Service)  (Highway)    (Warehouse)
```

---

## 1.2 What Happens When You Type "google.com" in Your Browser?

> **⚠️ IMPORTANT: This is one of the MOST asked interview questions. You must know every step.**

Here's the complete journey, step by step:

### Step 1: DNS Resolution (Finding the Address)
```
You type: google.com
Browser thinks: "I need the IP address of google.com"
```

**DNS (Domain Name System)** converts human-readable domain names to IP addresses.

**DNS Lookup Process (in order):**
1. **Browser Cache** — "Have I visited this site recently?" (checks local cache)
2. **OS Cache** — "Does my operating system know?" (checks `/etc/hosts` on Mac/Linux)
3. **Router Cache** — "Does my router know?"
4. **ISP's DNS Server** — "Ask my internet provider"
5. **Root DNS Server** — "I don't know google.com, but I know who manages .com domains"
6. **TLD (Top-Level Domain) Server** — "I manage all .com domains. google.com is handled by Google's nameserver"
7. **Authoritative DNS Server** — "google.com lives at IP address 142.250.190.78"

```
Your Browser
    │
    ▼
Browser Cache (miss) → OS Cache (miss) → Router Cache (miss)
    │
    ▼
ISP DNS Server (miss)
    │
    ▼
Root DNS Server ──→ ".com TLD Server" ──→ Google's DNS Server
                                              │
                                              ▼
                                        IP: 142.250.190.78
```

**Why this matters for interviews:**
- DNS is like a phonebook for the internet
- Each lookup adds latency (that's why caching exists)
- DNS uses UDP protocol (faster than TCP for small lookups)

### Step 2: TCP Connection (The Handshake)

Now the browser knows the IP address. Before sending data, it needs to establish a reliable connection.

**TCP Three-Way Handshake:**
```
Client (Browser)                    Server (Google)
      │                                  │
      │──── SYN (Hey, can we talk?) ────→│
      │                                  │
      │←── SYN-ACK (Sure, let's!) ──────│
      │                                  │
      │──── ACK (Great, we're on!) ─────→│
      │                                  │
      │     CONNECTION ESTABLISHED        │
```

- **SYN** = Synchronize (Client says "I want to connect")
- **SYN-ACK** = Synchronize-Acknowledge (Server says "OK, I'm ready too")
- **ACK** = Acknowledge (Client says "Let's go!")

**Analogy:** It's like a phone call:
1. You dial (SYN)
2. They pick up and say "Hello?" (SYN-ACK)
3. You say "Hi! I want to ask something" (ACK)

### Step 3: TLS/SSL Handshake (for HTTPS — Securing the Connection)

If the URL starts with `https://`, an additional security step happens:

```
Client                              Server
  │                                    │
  │── "Hello, I support these         │
  │    encryption methods" ──────────→│
  │                                    │
  │←── "Let's use this method.        │
  │     Here's my SSL certificate"────│
  │                                    │
  │── (Verifies certificate with       │
  │    Certificate Authority)          │
  │                                    │
  │── "Here's a shared secret key     │
  │    encrypted with your public     │
  │    key" ──────────────────────────→│
  │                                    │
  │     ENCRYPTED CONNECTION           │
```

**HTTP vs HTTPS:**
| Feature | HTTP | HTTPS |
|---------|------|-------|
| Full Form | HyperText Transfer Protocol | HTTP Secure |
| Port | 80 | 443 |
| Encryption | ❌ None | ✅ TLS/SSL |
| Data visibility | Anyone can read | Encrypted |
| SEO | Lower ranking | Higher ranking |
| Use case | Never (don't use this) | Always |

### Step 4: HTTP Request (Asking for the Page)

The browser sends an HTTP request:

```
GET / HTTP/1.1
Host: google.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
Accept: text/html,application/xhtml+xml
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Cookie: session_id=abc123
```

**Breaking this down:**
- **GET** = HTTP Method (what action you want)
- **/** = Path (which page — `/` means homepage)
- **HTTP/1.1** = Protocol version
- **Host** = Which domain
- **Headers** = Extra information (like a cover letter with your request)

**HTTP Methods (CRUD operations):**
| Method | Action | Example | CRUD |
|--------|--------|---------|------|
| GET | Read/Retrieve data | Get a blog post | READ |
| POST | Create new data | Submit a form | CREATE |
| PUT | Update entire resource | Update full profile | UPDATE |
| PATCH | Update partial resource | Update just email | UPDATE |
| DELETE | Remove data | Delete a comment | DELETE |

### Step 5: Server Processes Request

```
Incoming Request
     │
     ▼
Web Server (Nginx/Apache)    ← Handles static files, load balancing
     │
     ▼
Application Server (Node.js) ← Runs your code, business logic
     │
     ▼
Database (MongoDB/PostgreSQL) ← Stores and retrieves data
     │
     ▼
Response prepared
```

### Step 6: HTTP Response

The server sends back a response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 12345
Cache-Control: max-age=3600
Set-Cookie: session_id=xyz789

<!DOCTYPE html>
<html>
<head><title>Google</title></head>
<body>...</body>
</html>
```

**HTTP Status Codes (MUST KNOW):**
| Code Range | Category | Examples |
|------------|----------|----------|
| **1xx** | Informational | 100 Continue |
| **2xx** | Success ✅ | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection ↪️ | 301 Moved Permanently, 302 Found, 304 Not Modified |
| **4xx** | Client Error ❌ | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests |
| **5xx** | Server Error 💥 | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

> **Interview Tip:** Know at least these: 200, 201, 204, 301, 302, 400, 401, 403, 404, 409, 429, 500, 502, 503

### Step 7: Browser Renders the Page

This is covered in the next section! ⬇️

---

## 1.3 Client-Server Architecture

```
┌─────────────────┐              ┌─────────────────┐
│     CLIENT      │   Request    │     SERVER      │
│  (Your Browser) │ ───────────→ │  (Backend App)  │
│                 │              │                 │
│  - HTML/CSS/JS  │   Response   │  - Node.js      │
│  - React/Angular│ ←─────────── │  - Express      │
│  - User sees    │              │  - Database     │
│    this part    │              │  - Business     │
│                 │              │    Logic        │
└─────────────────┘              └─────────────────┘
     FRONTEND                        BACKEND
```

**Frontend (Client Side):**
- What the user sees and interacts with
- HTML (structure), CSS (styling), JavaScript (behavior)
- Runs in the browser
- React, Angular, Vue are frontend frameworks

**Backend (Server Side):**
- Logic that happens behind the scenes
- Handles data storage, authentication, business rules
- Node.js, Express, Python/Django, Java/Spring
- The user never sees this code

---

# PART 2: WHAT IS A BROWSER & HOW IT RENDERS A PAGE
*Theory — 15 minutes*

---

## 2.1 What is a Browser?

A browser is a software application that:
1. Sends HTTP requests to servers
2. Receives responses (HTML, CSS, JS, images)
3. Renders (displays) the content visually
4. Executes JavaScript code

**Popular Browsers & Their Engines:**
| Browser | Rendering Engine | JS Engine |
|---------|-----------------|-----------|
| Chrome | Blink | **V8** |
| Firefox | Gecko | SpiderMonkey |
| Safari | WebKit | JavaScriptCore |
| Edge | Blink | **V8** |

> **Why V8 matters:** Node.js uses the **V8 engine** to run JavaScript outside the browser. So the same engine that runs JS in Chrome also powers your backend!

## 2.2 Browser Rendering Pipeline (Critical Rendering Path)

> **⚠️ IMPORTANT: Understanding this pipeline helps you write performant web apps. Interviewers ask "why is my page slow?" — this is the answer.**

When the browser receives HTML, CSS, and JS, here's what happens:

```
HTML ──→ DOM Tree
              │
              ├──→ Render Tree ──→ Layout ──→ Paint ──→ Composite ──→ PIXELS ON SCREEN
              │
CSS  ──→ CSSOM Tree
```

### Step-by-Step Breakdown:

**1. Parse HTML → Build DOM (Document Object Model)**
```html
<html>
  <body>
    <h1>Hello</h1>
    <p>World</p>
  </body>
</html>
```
Becomes:
```
           Document
              │
            <html>
              │
            <body>
           /      \
        <h1>      <p>
         │          │
       "Hello"   "World"
```
The DOM is a tree structure representing every element on the page.

**2. Parse CSS → Build CSSOM (CSS Object Model)**
```css
h1 { color: red; font-size: 24px; }
p  { color: blue; }
```
Becomes a tree of styles that maps to DOM elements.

**3. Combine DOM + CSSOM → Render Tree**
- Only includes **visible** elements
- `display: none` elements are excluded
- `visibility: hidden` elements ARE included (they take up space)

**4. Layout (Reflow)**
- Calculates the exact position and size of each element
- "This h1 is 24px tall, starts at position (0, 0), is 100% wide..."

**5. Paint**
- Fills in pixels — colors, text, borders, shadows, images

**6. Composite**
- Layers are combined in the correct order (z-index)
- GPU acceleration for transforms and opacity

### Where Does JavaScript Fit?

```
HTML Parsing ──→ Encounters <script> ──→ STOP PARSING ──→ Download JS ──→ Execute JS ──→ Resume Parsing
```

**This is why:**
- `<script>` tags block HTML parsing (render-blocking!)
- We put `<script>` at the **bottom** of `<body>`, OR
- We use `defer` or `async` attributes:
  - `<script defer>` — Download in parallel, execute after HTML parsing
  - `<script async>` — Download in parallel, execute immediately when ready

```
Without defer/async:
HTML: ████████░░░░░░████████████
JS:          ████████
             ↑ blocks HTML

With defer:
HTML: ██████████████████████████
JS:          ████████░░░░░░████
                              ↑ executes after HTML done

With async:
HTML: ████████░░░████████████████
JS:          ████████
             ↑ executes when ready (may interrupt HTML)
```

---

# PART 3: WHAT IS JAVASCRIPT?
*Theory — 10 minutes*

---

## 3.1 JavaScript — The Story

- **Created in 1995** by Brendan Eich at Netscape in just **10 days**
- Originally called "Mocha", then "LiveScript", then "JavaScript" (marketing name to ride Java's popularity)
- **JavaScript has NOTHING to do with Java** (common misconception)
- Standardized as **ECMAScript** (ES) — the official specification
  - ES5 (2009) — the "old" JavaScript
  - **ES6/ES2015** — the HUGE update (classes, arrow functions, let/const, promises, modules)
  - ES2016, ES2017, ... ES2024 — yearly updates with new features

## 3.2 Where Does JavaScript Run?

**Two environments:**

### 1. Browser (Frontend)
- Every browser has a JS engine built in
- Has access to: DOM, Window, Document, localStorage, fetch, setTimeout
- Does NOT have access to: file system, OS-level operations

### 2. Node.js (Backend)
- **Node.js = V8 Engine + libuv + C++ bindings**
- Created by Ryan Dahl in 2009
- Has access to: file system (`fs`), networking, OS operations, databases
- Does NOT have access to: DOM, Window, Document (there's no browser!)

```
┌─────────────────────────────────────────────┐
│              JAVASCRIPT                      │
│                                              │
│  ┌─────────────────┐  ┌──────────────────┐  │
│  │    BROWSER       │  │    NODE.JS       │  │
│  │                  │  │                  │  │
│  │  ✅ DOM          │  │  ✅ File System  │  │
│  │  ✅ Window       │  │  ✅ HTTP Server  │  │
│  │  ✅ Document     │  │  ✅ OS Access    │  │
│  │  ✅ localStorage │  │  ✅ npm packages │  │
│  │  ✅ fetch/XHR    │  │  ✅ Databases    │  │
│  │  ❌ File System  │  │  ❌ DOM          │  │
│  │  ❌ OS Access    │  │  ❌ Window       │  │
│  └─────────────────┘  └──────────────────┘  │
│                                              │
│  Shared: console, setTimeout, JSON,         │
│  Promise, Math, Array, Object, String...    │
└─────────────────────────────────────────────┘
```

## 3.3 JavaScript Engine Internals

> **💡 NOTE: You don't need to memorize this deeply, but knowing the high-level process impresses interviewers.**

When JavaScript code runs, the engine does this:

```
Source Code (your .js file)
       │
       ▼
   ┌────────┐
   │ Parser │ ← Reads your code, checks for syntax errors
   └────────┘
       │
       ▼
   ┌────────────────┐
   │ AST (Abstract  │ ← Tree representation of your code
   │ Syntax Tree)   │
   └────────────────┘
       │
       ▼
   ┌─────────────┐
   │ Interpreter │ ← Converts to bytecode (fast startup)
   │ (Ignition)  │
   └─────────────┘
       │
       ▼
   ┌──────────────────┐
   │ Optimizing       │ ← Hot code gets compiled to machine code
   │ Compiler         │    (JIT - Just In Time compilation)
   │ (TurboFan in V8) │
   └──────────────────┘
       │
       ▼
   Machine Code (runs on CPU)
```

**Key Point:** JavaScript is **interpreted + JIT compiled**. It starts interpreting immediately (fast startup), then optimizes frequently-run code by compiling it (fast execution).

## 3.4 JavaScript is Single-Threaded

**What does "single-threaded" mean?**
- JavaScript has only ONE call stack
- It can do only ONE thing at a time
- It executes code line by line, top to bottom

**Then how does it handle multiple tasks (like API calls)?**
- Using the **Event Loop** (we'll cover this deeply on Saturday!)
- Async operations are offloaded to the browser/Node.js APIs
- Results come back via callbacks/promises when ready

---

# PART 4: SETTING UP YOUR DEVELOPMENT ENVIRONMENT
*Hands-on — 15 minutes*

---

## 4.1 Install These Tools

### 1. VS Code (Code Editor)
- Download from: https://code.visualstudio.com/
- **Essential Extensions to install:**
  - ESLint (code quality)
  - Prettier (code formatting)
  - JavaScript (ES6) code snippets
  - Auto Rename Tag
  - Bracket Pair Colorizer (built-in now)
  - Material Icon Theme
  - Live Server

### 2. Node.js (JavaScript Runtime)
- Download **LTS version** from: https://nodejs.org/
- After install, verify in terminal:
```bash
node --version    # Should show v18.x.x or v20.x.x
npm --version     # Should show 9.x.x or 10.x.x
```

### 3. Git (Version Control)
- Download from: https://git-scm.com/
- After install:
```bash
git --version     # Should show git version 2.x.x

# Configure (one time setup):
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 4.2 Your First JavaScript File

Create a project folder and file:
```bash
mkdir ~/Desktop/js-learning
cd ~/Desktop/js-learning
touch day01.js
code .          # Opens VS Code in this folder
```

In `day01.js`, write:
```javascript
console.log("Hello, World! I'm learning JavaScript! 🚀");
```

Run it in the terminal:
```bash
node day01.js
```

You should see: `Hello, World! I'm learning JavaScript! 🚀`

**Or use Node REPL (interactive mode):**
```bash
node          # Starts interactive mode
> 2 + 3      # Type JavaScript and see instant results
5
> "Hello".toUpperCase()
'HELLO'
> .exit       # Type .exit to quit
```

---

# PART 5: VARIABLES — `var`, `let`, `const`
*This is where real JavaScript begins — 25 minutes*

---

## 5.1 What is a Variable?

A variable is a **named container** that stores a value in computer memory.

**Analogy:** Think of variables like **labeled boxes** 📦
- The label = variable name
- What's inside = the value
- The box type = `var`, `let`, or `const`

## 5.2 Three Ways to Declare Variables

```javascript
var name = "Rahul";        // OLD way (ES5) - avoid this
let age = 25;              // NEW way (ES6) - use for values that change
const country = "India";   // NEW way (ES6) - use for values that DON'T change
```

## 5.3 `var` — The Problematic One

```javascript
var message = "Hello";
var message = "World";  // ✅ No error! Re-declaration allowed
message = "Changed";    // ✅ Re-assignment allowed
```

**Problems with `var`:**

### Problem 1: Function-scoped (NOT block-scoped)
```javascript
if (true) {
    var x = 10;
}
console.log(x);  // 10 ✅ — var LEAKS out of if/for blocks!

// Compare with let:
if (true) {
    let y = 20;
}
console.log(y);  // ❌ ReferenceError: y is not defined
```

**What is Scope?**
- **Scope** = Where a variable can be accessed
- `var` is **function-scoped** — it's available throughout the entire function
- `let`/`const` are **block-scoped** — they're only available inside `{ }`

```javascript
function example() {
    // This entire function is var's scope
    if (true) {
        var a = 1;    // Available in entire function
        let b = 2;    // Available only in this if-block
        const c = 3;  // Available only in this if-block
    }
    console.log(a);  // 1 ✅
    console.log(b);  // ❌ ReferenceError
    console.log(c);  // ❌ ReferenceError
}
```

### Problem 2: Hoisting with `var`

> **⚠️ IMPORTANT: Hoisting is one of the most asked JavaScript interview topics. Understand this deeply.**

**What is Hoisting?**
Hoisting is JavaScript's behavior of moving variable and function **declarations** to the top of their scope BEFORE code execution.

**CRITICAL:** Only the **declaration** is hoisted, NOT the **initialization** (assignment).

```javascript
console.log(greeting);  // undefined (NOT an error!)
var greeting = "Hello";
console.log(greeting);  // "Hello"
```

**What JavaScript actually does (behind the scenes):**
```javascript
// CREATION PHASE (before your code runs):
var greeting;           // Declaration is hoisted to the top
                        // greeting = undefined (default value)

// EXECUTION PHASE (your code runs):
console.log(greeting);  // undefined
greeting = "Hello";     // NOW it gets assigned
console.log(greeting);  // "Hello"
```

**How to explain this in an interview:**
> "JavaScript execution happens in two phases. In the **creation phase**, the engine scans the code and allocates memory for all variable and function declarations. `var` variables are initialized with `undefined` during this phase. In the **execution phase**, the code runs line by line and assignments happen."

### Problem 3: The Classic Loop Problem
```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
// Output: 3, 3, 3 (NOT 0, 1, 2!)
// Why? Because var is function-scoped, there's only ONE 'i'
// By the time setTimeout runs, the loop is done and i = 3
```

## 5.4 `let` — The Modern Variable

```javascript
let age = 25;
age = 26;           // ✅ Re-assignment allowed
let age = 30;       // ❌ SyntaxError: already declared (no re-declaration)
```

**Key differences from `var`:**

### 1. Block-scoped
```javascript
{
    let x = 10;
    console.log(x);  // 10 ✅
}
console.log(x);      // ❌ ReferenceError
```

### 2. No hoisting? Actually, it IS hoisted, but differently!

> **🚨 CAUTION: This is a tricky interview point. `let` and `const` ARE hoisted, but they're placed in a Temporal Dead Zone (TDZ).**

```javascript
console.log(a);  // undefined (var is hoisted + initialized with undefined)
var a = 10;

console.log(b);  // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 20;      // b IS hoisted, but it's in the TDZ until this line
```

**Temporal Dead Zone (TDZ):**
```javascript
// ──── TDZ for 'name' starts here ────
// You cannot access 'name' in this zone
// Even though it's hoisted, it's uninitialized
console.log(name);  // ❌ ReferenceError
// ──── TDZ for 'name' ends here ────
let name = "Rahul"; // Declaration + initialization
console.log(name);  // ✅ "Rahul"
```

**Interview Answer for "Is let hoisted?":**
> "Yes, `let` is hoisted, but unlike `var`, it's not initialized with `undefined`. It stays in the Temporal Dead Zone from the start of the block until the declaration is encountered. Accessing it in the TDZ throws a ReferenceError. This makes `let` safer than `var` because it prevents accidental use of variables before they're defined."

### 3. Fixes the loop problem
```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
// Output: 0, 1, 2 ✅
// Why? let creates a NEW 'i' for each iteration (block-scoped)
```

## 5.5 `const` — The Constant

```javascript
const PI = 3.14159;
PI = 3.14;          // ❌ TypeError: Assignment to constant variable
const PI = 3.14;    // ❌ SyntaxError: already declared

const name;         // ❌ SyntaxError: Missing initializer
                    // const MUST be initialized when declared
```

**IMPORTANT — `const` with Objects and Arrays:**

> **⚠️ WARNING: `const` does NOT make the value immutable. It only prevents re-assignment of the variable. The contents of objects and arrays CAN still be changed!**

```javascript
const user = { name: "Rahul", age: 25 };

// ✅ Modifying properties is ALLOWED:
user.name = "Amit";
user.city = "Mumbai";
console.log(user);  // { name: "Amit", age: 25, city: "Mumbai" }

// ❌ Re-assigning the variable is NOT allowed:
user = { name: "New User" };  // TypeError!

// Same with arrays:
const colors = ["red", "blue"];
colors.push("green");    // ✅ Allowed
colors[0] = "yellow";    // ✅ Allowed
colors = ["new array"];  // ❌ TypeError!
```

**Why?** Because `const` protects the **reference** (the pointer to the memory location), not the **value** itself. Objects and arrays are stored by reference.

**To make an object truly immutable:**
```javascript
const user = Object.freeze({ name: "Rahul", age: 25 });
user.name = "Amit";  // Silently fails (no error, but no change)
console.log(user.name);  // "Rahul" (unchanged)

// Note: Object.freeze is SHALLOW — nested objects are NOT frozen
const data = Object.freeze({ info: { name: "Rahul" } });
data.info.name = "Amit";  // ✅ This WORKS (nested object not frozen)
```

## 5.6 Comparison Table (Print This Out!)

| Feature | `var` | `let` | `const` |
|---------|-------|-------|---------|
| Scope | Function | Block `{}` | Block `{}` |
| Hoisted? | ✅ Yes (initialized with `undefined`) | ✅ Yes (TDZ — uninitialized) | ✅ Yes (TDZ — uninitialized) |
| Re-declaration | ✅ Allowed | ❌ Not allowed | ❌ Not allowed |
| Re-assignment | ✅ Allowed | ✅ Allowed | ❌ Not allowed |
| Must initialize? | No | No | ✅ Yes |
| Use case | ❌ Never use | Values that change | Everything else (default) |

## 5.7 Memory — How Variables are Stored

```
STACK MEMORY (fast, small)          HEAP MEMORY (slow, large)
┌──────────────────────┐           ┌──────────────────────┐
│ name = "Rahul"       │           │                      │
│ age  = 25            │           │  { name: "Rahul",    │
│ isStudent = true     │           │    age: 25 }         │
│                      │           │         ↑            │
│ user = ─────────────────────────→│   (object stored     │
│        (reference/   │           │    in heap)          │
│         pointer)     │           │                      │
└──────────────────────┘           └──────────────────────┘

Primitive types → stored directly in STACK
Objects, Arrays → stored in HEAP (stack holds the reference/address)
```

> **Interview Tip:** This is why `const` with objects allows mutation — the stack holds a pointer, and `const` only freezes the pointer, not the heap data.

## 5.8 Best Practice Rule

```
🏆 DEFAULT: Always use const
↓ Need to reassign? Use let
↓ Never use var (legacy code only)
```

---

# PART 6: DATA TYPES
*25 minutes*

---

## 6.1 Two Categories of Data Types

JavaScript has **8 data types** divided into two categories:

```
DATA TYPES
├── PRIMITIVE (7 types) — Stored in Stack, Immutable, Compared by VALUE
│   ├── String
│   ├── Number
│   ├── Boolean
│   ├── undefined
│   ├── null
│   ├── Symbol (ES6)
│   └── BigInt (ES2020)
│
└── NON-PRIMITIVE (1 type) — Stored in Heap, Mutable, Compared by REFERENCE
    └── Object (includes Arrays, Functions, Dates, RegExp, etc.)
```

## 6.2 Primitive Types — Detailed

### 1. String
```javascript
// Three ways to create strings:
const single = 'Hello';           // Single quotes
const double = "Hello";           // Double quotes
const template = `Hello ${name}`; // Template literals (backticks) — ES6

// Strings are IMMUTABLE (can't change individual characters):
let str = "Hello";
str[0] = "J";        // Silently fails
console.log(str);    // "Hello" (unchanged)
str = "Jello";       // This works — you're creating a NEW string

// Useful string methods (these return NEW strings, don't modify original):
const text = "Hello, World!";
text.length;              // 13
text.toUpperCase();       // "HELLO, WORLD!"
text.toLowerCase();       // "hello, world!"
text.includes("World");  // true
text.startsWith("Hello"); // true
text.indexOf("World");   // 7
text.slice(0, 5);        // "Hello" (start, end - exclusive)
text.substring(0, 5);    // "Hello"
text.split(", ");        // ["Hello", "World!"]
text.trim();             // Removes whitespace from both ends
text.replace("World", "JS"); // "Hello, JS!"
text.repeat(3);          // "Hello, World!Hello, World!Hello, World!"
text.padStart(20, "*");  // "*******Hello, World!"
text.at(-1);             // "!" (negative indexing — ES2022)
```

### 2. Number
```javascript
const integer = 42;
const float = 3.14;
const negative = -10;
const scientific = 2.5e6;     // 2500000
const binary = 0b1010;        // 10 (binary)
const octal = 0o777;          // 511 (octal)
const hex = 0xFF;             // 255 (hexadecimal)

// Special numeric values:
const inf = Infinity;          // Larger than any number
const negInf = -Infinity;
const notANumber = NaN;        // "Not a Number"

// NaN — the weird one:
console.log(NaN === NaN);     // false! (NaN is NOT equal to itself!)
console.log(isNaN(NaN));      // true
console.log(Number.isNaN(NaN)); // true (better — stricter check)
console.log(isNaN("hello"));   // true (converts "hello" to number first → NaN)
console.log(Number.isNaN("hello")); // false (doesn't convert — "hello" is not NaN)

// Floating point precision problem:
console.log(0.1 + 0.2);       // 0.30000000000000004 (NOT 0.3!)
console.log(0.1 + 0.2 === 0.3); // false!

// Fix: Use toFixed() or multiply/divide
console.log((0.1 + 0.2).toFixed(1));  // "0.3" (string)
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);  // true

// Safe integer range:
console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991 (2^53 - 1)
console.log(Number.MIN_SAFE_INTEGER);  // -9007199254740991
```

> **Interview Question: "Why does 0.1 + 0.2 !== 0.3?"**
> Answer: "JavaScript uses IEEE 754 double-precision floating-point format to store numbers. Some decimal numbers (like 0.1 and 0.2) cannot be represented exactly in binary, leading to tiny rounding errors. This is not a JavaScript-specific issue — it happens in most programming languages."

### 3. Boolean
```javascript
const isLoggedIn = true;
const hasPermission = false;

// Falsy values (convert to false in boolean context):
// false, 0, -0, 0n, "", null, undefined, NaN
// EVERYTHING else is truthy (including "0", "false", [], {}, function(){})

// Examples:
if ("") console.log("empty string");       // won't run (falsy)
if ("0") console.log("string zero");       // WILL run (truthy!)
if (0) console.log("number zero");         // won't run (falsy)
if ([]) console.log("empty array");        // WILL run (truthy!)
if ({}) console.log("empty object");       // WILL run (truthy!)
```

> **🚨 CAUTION: Interview Favorite — Empty array `[]` and empty object `{}` are TRUTHY in JavaScript! This catches many developers off guard.**

### 4. undefined
```javascript
// undefined means: "A variable has been declared but not assigned a value"
let x;
console.log(x);        // undefined
console.log(typeof x);  // "undefined"

// Function with no return:
function doNothing() {}
console.log(doNothing());  // undefined

// Accessing non-existent property:
const obj = { name: "Rahul" };
console.log(obj.age);  // undefined (property doesn't exist)
```

### 5. null
```javascript
// null means: "Intentionally empty / no value"
// It's assigned by the programmer deliberately
let user = null;  // "There is no user right now"
console.log(typeof null);  // "object" ← THIS IS A BUG IN JS!
```

> **Interview Question: "Why is typeof null === 'object'?"**
> Answer: "This is a known bug in JavaScript that dates back to its first implementation in 1995. In the original implementation, values were stored with a type tag. Objects had type tag 0, and null was represented as the NULL pointer (0x00). So null's type tag was 0, which made typeof return 'object'. This was later recognized as a bug, but fixing it would break too much existing code on the web, so it was never fixed."

### 6. undefined vs null
```javascript
console.log(undefined == null);   // true (loose equality)
console.log(undefined === null);  // false (strict equality)

console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" (the bug)

// When to use which:
// undefined → Let JavaScript assign it (variable not yet assigned)
// null → YOU assign it to indicate "no value intentionally"

let user = null;        // ✅ Good: explicitly saying "no user"
let user = undefined;   // ❌ Bad: looks like a mistake
```

### 7. Symbol (ES6)
```javascript
// Symbol creates a unique, immutable identifier
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2);  // false! (every Symbol is unique)

// Use case: Unique object property keys (avoid name collisions)
const USER_ID = Symbol("userId");
const user = {
    [USER_ID]: 12345,
    name: "Rahul"
};
console.log(user[USER_ID]);  // 12345

// Symbols don't show up in for...in or Object.keys():
Object.keys(user);          // ["name"] (Symbol hidden)
Object.getOwnPropertySymbols(user);  // [Symbol(userId)]
```

### 8. BigInt (ES2020)
```javascript
// For numbers larger than Number.MAX_SAFE_INTEGER
const bigNumber = 9007199254740991n;  // Add 'n' at the end
const anotherBig = BigInt("99999999999999999999");

console.log(bigNumber + 1n);  // 9007199254740992n
// Cannot mix BigInt with regular numbers:
// console.log(bigNumber + 1);  // ❌ TypeError
console.log(bigNumber + BigInt(1));  // ✅
```

## 6.3 Non-Primitive Type — Object

```javascript
// Objects, Arrays, Functions — all are objects internally
const person = { name: "Rahul", age: 25 };  // Object literal
const colors = ["red", "blue", "green"];     // Array (special object)
const greet = function() { return "Hi"; };   // Function (callable object)

console.log(typeof person);  // "object"
console.log(typeof colors);  // "object" (arrays are objects!)
console.log(typeof greet);   // "function" (special case)

// How to check if something is an array:
Array.isArray(colors);  // true
Array.isArray(person);  // false
```

## 6.4 Value vs Reference (MUST UNDERSTAND!)

```javascript
// PRIMITIVES — Copied by VALUE
let a = 10;
let b = a;     // b gets a COPY of a's value
b = 20;
console.log(a);  // 10 (unchanged! They're independent)

// OBJECTS — Copied by REFERENCE
let obj1 = { name: "Rahul" };
let obj2 = obj1;  // obj2 gets the same REFERENCE (pointer)
obj2.name = "Amit";
console.log(obj1.name);  // "Amit" (changed! They point to same object)
```

**Visual:**
```
PRIMITIVES (by value):
┌──────┐    ┌──────┐
│ a=10 │    │ b=10 │  ← Two separate copies
└──────┘    └──────┘
After b=20:
┌──────┐    ┌──────┐
│ a=10 │    │ b=20 │  ← Independent
└──────┘    └──────┘

OBJECTS (by reference):
┌──────┐    ┌──────────────────────────┐
│ obj1 │───→│ { name: "Rahul" }        │
└──────┘    └──────────────────────────┘
┌──────┐         ↑
│ obj2 │─────────┘  ← Both point to SAME object
└──────┘
```

> **Interview Question: "How do you create a true copy of an object?"**
```javascript
// Shallow copy (copies only first level):
const copy1 = { ...original };              // Spread operator
const copy2 = Object.assign({}, original);  // Object.assign

// Deep copy (copies nested objects too):
const deepCopy = JSON.parse(JSON.stringify(original));  // Simple but has limitations
const deepCopy2 = structuredClone(original);  // Modern way (2022+) ← BEST
```

---

# PART 7: THE `typeof` OPERATOR
*5 minutes*

---

```javascript
console.log(typeof "hello");      // "string"
console.log(typeof 42);          // "number"
console.log(typeof 3.14);       // "number" (no separate float type)
console.log(typeof true);       // "boolean"
console.log(typeof undefined);  // "undefined"
console.log(typeof null);       // "object"     ← BUG!
console.log(typeof Symbol());   // "symbol"
console.log(typeof 42n);        // "bigint"
console.log(typeof {});         // "object"
console.log(typeof []);         // "object"     ← Arrays are objects!
console.log(typeof function(){}); // "function" ← Special case
console.log(typeof NaN);        // "number"    ← NaN is technically a number!

// Better type checking:
Array.isArray([]);              // true (check for arrays)
obj === null;                    // true (check for null)
obj instanceof Date;             // true (check for specific class)
Object.prototype.toString.call(value);  // "[object Array]", "[object Null]", etc.
```

---

# PART 8: TYPE COERCION & TYPE CONVERSION
*15 minutes*

---

## 8.1 Explicit Type Conversion (You do it intentionally)

```javascript
// To String:
String(123);         // "123"
String(true);        // "true"
String(null);        // "null"
String(undefined);   // "undefined"
(123).toString();    // "123"
123 + "";            // "123" (trick using concatenation)

// To Number:
Number("123");       // 123
Number("123.45");    // 123.45
Number("");          // 0
Number(" ");         // 0
Number("hello");     // NaN
Number(true);        // 1
Number(false);       // 0
Number(null);        // 0
Number(undefined);   // NaN
parseInt("123px");   // 123 (parses until non-numeric)
parseFloat("3.14"); // 3.14
+"42";               // 42 (unary plus — quick conversion trick)

// To Boolean:
Boolean(0);          // false
Boolean("");         // false
Boolean(null);       // false
Boolean(undefined);  // false
Boolean(NaN);        // false
Boolean("hello");    // true
Boolean(42);         // true
Boolean([]);         // true  ← empty array is truthy!
Boolean({});         // true  ← empty object is truthy!
!!value;             // converts to boolean (double NOT trick)
```

## 8.2 Implicit Type Coercion (JavaScript does it automatically)

> **⚠️ WARNING: This is one of JavaScript's most confusing features and a VERY common interview topic. Learn the rules, don't just memorize outputs.**

### Rule 1: String + anything = String (concatenation wins)
```javascript
console.log("5" + 3);       // "53" (3 becomes "3")
console.log("5" + true);    // "5true"
console.log("5" + null);    // "5null"
console.log("5" + undefined); // "5undefined"
console.log("5" + {});      // "5[object Object]"
console.log("5" + [1,2]);   // "51,2"
```

### Rule 2: Other math operators convert to Number
```javascript
console.log("5" - 3);       // 2 (string → number)
console.log("5" * 2);       // 10
console.log("5" / 2);       // 2.5
console.log("5" % 2);       // 1
console.log("abc" - 1);     // NaN
console.log(true + true);   // 2 (true → 1)
console.log(true + false);  // 1
```

### Rule 3: `==` (Loose Equality) does type coercion, `===` does NOT

```javascript
// === (Strict Equality) — NO coercion, checks type AND value
console.log(5 === 5);       // true
console.log(5 === "5");     // false (different types)
console.log(null === undefined); // false

// == (Loose Equality) — DOES coercion
console.log(5 == "5");      // true ("5" converted to 5)
console.log(0 == false);    // true (false → 0)
console.log("" == false);   // true ("" → 0, false → 0)
console.log(null == undefined); // true (special rule)
console.log(null == 0);     // false (null only == undefined)
console.log(NaN == NaN);    // false (NaN is never equal to anything)
```

**The Abstract Equality Algorithm (== rules):**
```
When using ==:
1. Same type? → Compare normally
2. null == undefined? → true
3. Number vs String? → Convert String to Number
4. Boolean vs anything? → Convert Boolean to Number first, then compare
5. Object vs Primitive? → Convert Object using .valueOf() then .toString()
```

**Example walkthrough:**
```javascript
"" == false
// Step 1: Boolean vs String → Convert false to Number → 0
// Now it's: "" == 0
// Step 2: String vs Number → Convert "" to Number → 0
// Now it's: 0 == 0
// Result: true
```

## 8.3 The Tricky Interview Questions

```javascript
// These are REAL interview questions. Predict each output:

console.log([] + []);           // "" (empty string)
console.log([] + {});           // "[object Object]"
console.log({} + []);           // "[object Object]" or 0 (depends on context)
console.log(true + true + true); // 3
console.log(true - true);      // 0
console.log(true == []);       // false
console.log(true == [1]);      // true (wild, right?)
console.log(false == []);      // true

console.log(!!"false");        // true (non-empty string)
console.log(!!"");             // false (empty string)
console.log(!!0);              // false
console.log(!!null);           // false
console.log(!![]);             // true (arrays are truthy!)
console.log(!!{});             // true

console.log(1 < 2 < 3);       // true (but for wrong reason!)
// (1 < 2) → true → (true < 3) → (1 < 3) → true

console.log(3 > 2 > 1);       // false!
// (3 > 2) → true → (true > 1) → (1 > 1) → false!
```

## 8.4 Best Practices

```javascript
// ✅ ALWAYS use === (strict equality)
if (x === 5) { }

// ❌ NEVER use == (loose equality)
if (x == 5) { }

// Only exception: checking for null/undefined together
if (x == null) { }  // This checks for both null and undefined
// Same as:
if (x === null || x === undefined) { }
```

---

# 📝 PRACTICE PROBLEMS — DAY 1 HOMEWORK

---

### Problem Set A: Variables & Scope
```javascript
// 1. Predict the output:
var a = 1;
function test() {
    console.log(a);   // ?
    var a = 2;
    console.log(a);   // ?
}
test();
console.log(a);       // ?

// 2. Predict the output:
let x = 10;
{
    console.log(x);   // ? (TDZ question)
    let x = 20;
}

// 3. What happens? Why?
const arr = [1, 2, 3];
arr.push(4);
console.log(arr);      // ?
arr = [5, 6];          // ?
```

### Problem Set B: Type Coercion
```javascript
// Predict ALL outputs:
console.log(1 + "2" + "2");    // ?
console.log(1 + +"2" + "2");   // ?
console.log(1 + -"1" + "2");   // ?
console.log(+"1" + "1" + "2"); // ?
console.log("A" - "B" + "2"); // ?
console.log("A" - "B" + 2);   // ?
```

### Problem Set C: Understanding Types
```javascript
// 1. Write a function that returns the true type of any value:
//    trueType([])    → "array"
//    trueType(null)  → "null"
//    trueType(42)    → "number"
//    trueType({})    → "object"
//    trueType("hi")  → "string"

// 2. Write a function that deep compares two values:
//    deepEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}})  → true
//    deepEqual([1, [2, 3]], [1, [2, 3]])                → true
//    deepEqual({a: 1}, {a: 2})                          → false

// 3. Write 10 examples where == gives true but === gives false
```

### Problem Set D: Type Conversion
```javascript
// Convert without using Number(), String(), Boolean():
// 1. Convert string "42" to number 42
// 2. Convert number 42 to string "42"
// 3. Convert any value to boolean
// 4. Convert array [1, 2, 3] to string "1,2,3"
// 5. Convert string "3.14" to float 3.14
```

---

# 🎯 DAY 1 INTERVIEW CHEAT SHEET

---

**Q: What happens when you type a URL in the browser?**
> DNS lookup → TCP handshake → TLS handshake (HTTPS) → HTTP request → Server processes → HTTP response → Browser renders (DOM → CSSOM → Render Tree → Layout → Paint → Composite)

**Q: Difference between var, let, const?**
> var is function-scoped and hoisted with undefined. let and const are block-scoped and hoisted but in TDZ. const can't be reassigned but object properties can be mutated.

**Q: What is hoisting?**
> JavaScript moves declarations to the top of their scope during the creation phase. var is initialized with undefined, let/const enter TDZ, function declarations are fully hoisted.

**Q: What is TDZ?**
> Temporal Dead Zone — the period between entering a block and the let/const declaration being reached. Accessing the variable in TDZ throws ReferenceError.

**Q: What are the 8 data types?**
> Primitives: string, number, boolean, undefined, null, symbol, bigint. Non-primitive: object (includes arrays, functions).

**Q: Why is typeof null === 'object'?**
> It's a historical bug from JavaScript's first implementation where null's type tag was 0, same as objects.

**Q: Difference between == and ===?**
> === checks type AND value without coercion. == performs type coercion before comparison. Always use ===.

**Q: What are falsy values?**
> false, 0, -0, 0n, "", null, undefined, NaN. Everything else is truthy, including [], {}, and "0".

**Q: Difference between null and undefined?**
> undefined = declared but not assigned (set by JS engine). null = intentionally assigned empty value (set by programmer).

**Q: How are primitives different from objects?**
> Primitives are immutable, stored in stack, compared by value. Objects are mutable, stored in heap, compared by reference.

---

> ✅ **Day 1 Complete!** Tomorrow: Operators, Conditionals & Loops. Practice today's problems before moving on.
