# Week 2 Practice — Functions, Prototypes, Arrays

**Notes:** [01-javascript.md](../notes/01-javascript.md) — Sections 4–6

---

## Coding Exercises

### Exercise 1: Implement array methods from scratch
```javascript
function myMap(arr, fn) { /* no .map */ }
function myFilter(arr, fn) { /* no .filter */ }
function myReduce(arr, fn, initial) { /* no .reduce */ }
```

### Exercise 2: Flatten nested array
```javascript
flatten([1, [2, [3, [4]], 5]]); // [1, 2, 3, 4, 5]
// Handle arbitrary depth
```

### Exercise 3: Class inheritance
Create `Animal` → `Dog` → `GuideDog` with methods: speak(), fetch(), guide()

### Exercise 4: Group by
```javascript
groupBy([
  { name: "A", dept: "Eng" },
  { name: "B", dept: "HR" },
  { name: "C", dept: "Eng" },
], "dept");
// { Eng: [...], HR: [...] }
```

### Exercise 5: Curry function
```javascript
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); // 6
add(1, 2)(3); // 6
```

---

## LeetCode (Week 2)

| # | Problem | Difficulty | Pattern |
|---|---------|------------|---------|
| 6 | Product of Array Except Self | Medium | Prefix sum |
| 7 | Merge Sorted Array | Easy | Two pointers |
| 8 | Move Zeroes | Easy | Two pointers |
| 9 | Squares of Sorted Array | Easy | Two pointers |
| 10 | Is Subsequence | Easy | Two pointers |

Links: Search on leetcode.com by problem name.

---

## Checklist

- [ ] myMap, myFilter, myReduce tested
- [ ] Flatten works depth 5+
- [ ] Class hierarchy with instanceof checks
- [ ] LC 6 attempted (study solution if stuck 40+ min)
- [ ] Code in `mern-mastery/week-02`
