# Git — Complete Notes

---

## 1. Core Concepts

| Term | Meaning |
|------|---------|
| **Repository** | Project folder tracked by Git |
| **Commit** | Snapshot of code at a point in time |
| **Branch** | Independent line of development |
| **Merge** | Combine branch into another |
| **Remote** | Code hosted on GitHub/GitLab |
| **Staging area** | Files prepared for next commit |

---

## 2. Essential Commands

```bash
# Setup
git init
git clone https://github.com/user/repo.git

# Daily workflow
git status                    # see changes
git add file.js               # stage file
git add .                     # stage all
git commit -m "feat: add login"  # commit
git push origin main          # push to remote

# Branching
git branch feature-auth       # create branch
git checkout feature-auth     # switch branch
git checkout -b feature-auth  # create + switch
git merge feature-auth        # merge into current branch

# Undo
git restore file.js           # discard unstaged changes
git reset HEAD file.js        # unstage
git log --oneline             # view history
```

---

## 3. Commit Message Convention

```
feat: add user registration
fix: resolve token expiry bug
docs: update API README
refactor: extract auth middleware
test: add login integration tests
chore: update dependencies
```

---

## 4. Branch Strategy

```
main          ← production-ready code
├── develop   ← integration branch (optional)
├── feature/auth
├── feature/task-board
└── fix/login-bug
```

**Flow:** Create feature branch → commit → push → open Pull Request → review → merge to main

---

## 5. Merge Conflicts

When Git can't auto-merge:
```bash
git merge feature-x
# CONFLICT in app.js
# Edit file — remove <<<<<<, ======, >>>>>> markers
git add app.js
git commit -m "merge: resolve conflict in app.js"
```

---

## 6. .gitignore (Node.js)

```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
coverage/
```

---

## 7. Pull Request Best Practices

1. Small focused PRs (< 400 lines)
2. Clear title and description
3. Link to issue/ticket
4. All tests pass before review
5. Respond to review comments promptly

**Interview:** Employers check your GitHub — clean commits, good README, live demos matter.

---

## 8. Practice (Week 4)

1. Create repo `mern-mastery`
2. 5 commits with proper messages
3. Create + merge a feature branch
4. Intentionally create and resolve a conflict
5. Add README with project description
