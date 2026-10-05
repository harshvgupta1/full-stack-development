# Week 3 Practice — Async JS & Event Loop

**Notes:** [01-javascript.md](../notes/01-javascript.md) — Sections 7–10

---

## Coding Exercises

### Exercise 1: Event loop — predict then verify
```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
Promise.resolve().then(() => {
  console.log("D");
  setTimeout(() => console.log("E"), 0);
});
console.log("F");
```

### Exercise 2: Implement debounce
```javascript
function debounce(fn, delay) {
  // Cancel previous timer, run fn after delay ms of inactivity
}
// Test: search input simulation
```

### Exercise 3: Implement throttle
```javascript
function throttle(fn, limit) {
  // Run at most once per `limit` ms
}
```

### Exercise 4: Promise.all polyfill
```javascript
function promiseAll(promises) {
  // Return promise that resolves with array of results
  // Reject if any promise rejects
}
```

### Exercise 5: Retry with exponential backoff
```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  // Retry failed fetch: wait 1s, 2s, 4s between attempts
}
```

### Exercise 6: Implement bind
```javascript
Function.prototype.myBind = function(context, ...args) {
  // Cannot use native .bind
};
```

---

## LeetCode (Week 3)

| # | Problem | Difficulty |
|---|---------|------------|
| 11 | Valid Parentheses | Easy |
| 12 | Min Stack | Medium |
| 13 | Implement Queue using Stacks | Easy |
| 14 | Reverse Linked List | Easy |
| 15 | Merge Two Sorted Lists | Easy |

---

## Mini project (Weekend)
Build **CLI Todo App** using Node.js:
- Commands: add, list, complete, delete
- Store in `todos.json`
- Use async file read/write

---

## Checklist

- [ ] Event loop order correct on paper
- [ ] Debounce + throttle with tests
- [ ] promiseAll handles empty array
- [ ] CLI Todo working
- [ ] LC 11, 14 solved
