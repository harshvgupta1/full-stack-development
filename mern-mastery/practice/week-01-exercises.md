# Week 1 Practice — JavaScript Basics

**Notes:** [01-javascript.md](../notes/01-javascript.md) — Sections 1–3

---

## Coding Exercises

### Exercise 1: Variable quiz
Predict output, then run in Node:
```javascript
console.log(a); var a = 1;
console.log(b); let b = 2;
console.log(typeof null);
console.log([] + []);
console.log([] + {});
console.log({} + []);
```

### Exercise 2: FizzBuzz
Print 1–100. Multiples of 3 → "Fizz", 5 → "Buzz", both → "FizzBuzz".

### Exercise 3: Closure counter
```javascript
function createCounter(initial = 0) {
  // Return object with: increment(), decrement(), reset(), getValue()
}
```

### Exercise 4: `this` prediction
```javascript
const obj = {
  name: "Obj",
  greet: function() { return this.name; },
  greetArrow: () => this?.name,
};
console.log(obj.greet());
console.log(obj.greet.call({ name: "Other" }));
```

### Exercise 5: Array manipulation
Given `[3, 1, 4, 1, 5, 9, 2, 6]`:
1. Remove duplicates without `Set`
2. Find second largest
3. Rotate array by k positions

---

## LeetCode (Week 1)

| # | Problem | Difficulty | Pattern | Link |
|---|---------|------------|---------|------|
| 1 | Two Sum | Easy | Hash Map | [LC 1](https://leetcode.com/problems/two-sum/) |
| 2 | Valid Anagram | Easy | Hash Map | [LC 242](https://leetcode.com/problems/valid-anagram/) |
| 3 | Best Time to Buy and Sell Stock | Easy | Array | [LC 121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) |
| 4 | Contains Duplicate | Easy | Set | [LC 217](https://leetcode.com/problems/contains-duplicate/) |
| 5 | Maximum Subarray | Easy | Kadane | [LC 53](https://leetcode.com/problems/maximum-subarray/) |

**Where to practice:**leetcode.com → create account → add to "Week 1" list

**Target:** 5 problems this week (1 on weekdays, 2 on Sat, 2 on Sun)

---

## Solutions checklist

- [ ] Exercise 1 output written before running
- [ ] FizzBuzz working
- [ ] Counter closure complete
- [ ] LC 1 solved without looking at solution
- [ ] LC 242 solved
- [ ] All code pushed to GitHub repo `mern-mastery/week-01`
