# Week 4 Practice — TypeScript + Git

**Notes:** [02-typescript.md](../notes/02-typescript.md)

---

## TypeScript Exercises

### Exercise 1: Type the following
```javascript
// Convert to TypeScript with proper types
function processUsers(users) {
  return users
    .filter(u => u.age >= 18)
    .map(u => ({ id: u.id, name: u.name.toUpperCase() }));
}
```

### Exercise 2: Generic API wrapper
```typescript
// Implement:
async function apiCall<T>(url: string): Promise<ApiResponse<T>>
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}
```

### Exercise 3: Utility type practice
Given interface `Product`, create:
- `ProductCreate` (omit id, createdAt)
- `ProductUpdate` (partial of ProductCreate)
- `ProductPublic` (omit internal fields)

### Exercise 4: Type guard
```typescript
function isAdmin(user: User | Admin): user is Admin {
  // implement
}
```

### Exercise 5: Discriminated union
```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult<T>(result: Result<T>): T {
  // narrow and return data or throw
}
```

---

## Git Exercises

1. Initialize repo `mern-mastery`
2. Create branches: `main`, `week-04-ts-catalog`
3. Make 5 commits with meaningful messages
4. Create merge conflict intentionally → resolve it
5. Write `.gitignore` for Node.js project

---

## LeetCode (Week 4)

| # | Problem | Difficulty |
|---|---------|------------|
| 16 | Binary Search | Easy |
| 17 | Search Insert Position | Easy |
| 18 | First Bad Version | Easy |
| 19 | Longest Common Prefix | Easy |
| 20 | Roman to Integer | Easy |

---

## Mini project: TypeScript Catalog API
In-memory REST API with types:
- `GET/POST/PUT/DELETE /products`
- Zod validation
- Typed request/response

---

## Checklist

- [ ] All TS exercises compile with `strict: true`
- [ ] Git branch workflow practiced
- [ ] Catalog API runs with `ts-node` or `tsx`
- [ ] 5 LeetCode done
