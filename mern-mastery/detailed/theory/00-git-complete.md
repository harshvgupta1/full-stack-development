# Git — Complete Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 7 Sep 2026 – 13 Sep 2026 (Days 22–28)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> Comprehensive reference for version control, collaboration workflows, and interview preparation.

---

## Table of Contents

1. [Core Concepts](#1-core-concepts)
2. [Repository Setup](#2-repository-setup)
3. [Daily Workflow](#3-daily-workflow)
4. [Staging & Commits](#4-staging--commits)
5. [Branching Strategy](#5-branching-strategy)
6. [Merging & Rebasing](#6-merging--rebasing)
7. [Remote Operations](#7-remote-operations)
8. [Undoing Changes](#8-undoing-changes)
9. [Stash & Cherry-Pick](#9-stash--cherry-pick)
10. [Tags & Releases](#10-tags--releases)
11. [Git Hooks](#11-git-hooks)
12. [Monorepo & Submodules](#12-monorepo--submodules)
13. [GitHub Workflow](#13-github-workflow)
14. [Troubleshooting](#14-troubleshooting)
15. [Interview Q&A](#15-interview-qa)
16. [Practice Resources](#16-practice-resources)

---

## 1. Core Concepts

| Term | Meaning |
|------|---------|
| **Repository (repo)** | Project folder tracked by Git with full history |
| **Working Directory** | Files you edit on disk |
| **Staging Area (Index)** | Snapshot of changes prepared for next commit |
| **Commit** | Immutable snapshot of staged changes with metadata |
| **Branch** | Movable pointer to a commit; enables parallel work |
| **HEAD** | Pointer to current branch/commit |
| **Remote** | Copy of repo hosted elsewhere (GitHub, GitLab) |
| **Origin** | Default name for the primary remote |
| **Merge** | Combine histories of two branches |
| **Rebase** | Replay commits on top of another branch |
| **Conflict** | Overlapping edits Git cannot auto-resolve |
| **Detached HEAD** | HEAD points to commit, not a branch |

### The Three Trees

```
Working Directory  →  git add  →  Staging Area  →  git commit  →  Repository
     (edit)                          (prepare)                      (history)
```

---

## 2. Repository Setup

```bash
# Initialize new repo
git init                          # creates .git/ folder
git init -b main                  # start with main branch

# Clone existing repo
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git my-folder   # SSH, custom folder
git clone --depth 1 url           # shallow clone (CI, large repos)

# Configure identity (per-repo or global)
git config user.name "Your Name"
git config user.email "you@example.com"
git config --global core.editor "code --wait"
git config --global init.defaultBranch main

# View configuration
git config --list
git config user.name
```

### `.gitignore` Essentials

```gitignore
# Dependencies
node_modules/
.pnp/

# Environment
.env
.env.local
.env.*.local

# Build output
dist/
build/
.next/
out/

# OS / IDE
.DS_Store
.idea/
.vscode/*
!.vscode/extensions.json

# Logs
*.log
npm-debug.log*

# Coverage
coverage/
.nyc_output/
```

---

## 3. Daily Workflow

```bash
# Check state
git status                        # modified, staged, untracked
git diff                          # unstaged changes
git diff --staged                 # staged changes
git log --oneline --graph --all   # visual history

# Stage and commit
git add src/auth.ts               # specific file
git add src/                      # directory
git add -p src/auth.ts            # interactive hunks
git add .                         # all changes (respects .gitignore)
git commit -m "feat: add JWT refresh flow"

# Push and pull
git pull origin main              # fetch + merge
git pull --rebase origin main     # fetch + rebase (cleaner history)
git push origin feature-auth
git push -u origin feature-auth   # set upstream tracking
```

---

## 4. Staging & Commits

### Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`

**Examples:**
```
feat(auth): add refresh token rotation
fix(api): resolve race condition in order creation
docs(readme): add deployment instructions
refactor(user): extract validation into middleware
test(auth): add integration tests for login flow
chore(deps): upgrade express to 4.19
```

### Amending Commits

```bash
# Add forgotten files to last commit (NOT pushed yet)
git add forgotten.ts
git commit --amend --no-edit

# Change last commit message
git commit --amend -m "feat: corrected message"

# ⚠️ Never amend commits already pushed to shared branches
```

### Interactive Commit Creation

```bash
git commit                          # opens editor for full message
git commit -m "fix: typo" -m "Details here"
```

---

## 5. Branching Strategy

### Git Flow

```
main (production)
  └── develop (integration)
        ├── feature/user-auth
        ├── feature/payment
        └── release/1.2.0
              └── hotfix/critical-bug  (from main)
```

### GitHub Flow (Simpler)

```
main ← always deployable
  ├── feature/add-search
  ├── fix/login-redirect
  └── chore/upgrade-deps
```

### Trunk-Based Development

- Short-lived branches (< 1 day)
- Feature flags for incomplete work
- Frequent merges to main
- Used by Google, Meta at scale

### Branch Commands

```bash
git branch                          # list local branches
git branch -a                       # include remotes
git branch feature-x                # create branch
git checkout feature-x              # switch
git switch -c feature-x             # create + switch (modern)
git branch -d feature-x             # delete merged branch
git branch -D feature-x             # force delete
git rename-branch old new           # git branch -m old new
```

---

## 6. Merging & Rebasing

### Merge

```bash
git checkout main
git merge feature-auth              # creates merge commit (non-fast-forward)
git merge --no-ff feature-auth      # explicit merge commit
git merge --squash feature-auth     # squash all commits into one
git commit -m "feat: add auth"
```

**When to merge:** Shared branches, preserve full history, team prefers explicit merge commits.

### Rebase

```bash
git checkout feature-auth
git rebase main                     # replay feature commits on top of main
git rebase -i HEAD~3                # interactive: squash, reword, drop
```

**When to rebase:** Clean linear history, local/unpushed work, before opening PR.

**Golden Rule:** Never rebase commits that others have based work on.

### Merge Conflicts

```bash
git merge feature-x
# CONFLICT in src/app.ts

# 1. Open file, resolve markers:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> feature-x

# 2. Stage resolved files
git add src/app.ts
git merge --continue                # or git commit for merge

# Abort if needed
git merge --abort
git rebase --abort
```

---

## 7. Remote Operations

```bash
git remote -v                       # list remotes
git remote add upstream url         # add fork upstream
git fetch origin                    # download commits, don't merge
git fetch --all --prune             # fetch all, remove stale refs

# Track remote branch
git checkout -b feature-x origin/feature-x
git branch --set-upstream-to=origin/main main

# Force push (DANGEROUS — team coordination required)
git push --force-with-lease origin feature-x   # safer than --force
```

### Fork Workflow

```bash
# 1. Fork on GitHub
# 2. Clone your fork
git clone git@github.com:you/repo.git
cd repo
git remote add upstream git@github.com:original/repo.git

# 3. Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## 8. Undoing Changes

| Goal | Command |
|------|---------|
| Discard unstaged edits | `git restore file.js` |
| Unstage file | `git restore --staged file.js` |
| Undo last commit, keep changes | `git reset --soft HEAD~1` |
| Undo last commit, discard changes | `git reset --hard HEAD~1` |
| Revert a commit (safe for shared) | `git revert abc123` |
| Find lost commits | `git reflog` |
| Restore deleted file | `git checkout HEAD -- file.js` |

```bash
# Reflog — your safety net
git reflog
git reset --hard HEAD@{2}           # go back to reflog entry

# Revert creates new commit undoing changes
git revert abc123 --no-edit
git revert HEAD~3..HEAD             # revert range
```

---

## 9. Stash & Cherry-Pick

### Stash

```bash
git stash                           # save WIP, clean working tree
git stash push -m "WIP auth refactor"
git stash list
git stash pop                       # apply and remove
git stash apply stash@{1}           # apply, keep stash
git stash drop stash@{0}
git stash clear
```

### Cherry-Pick

```bash
# Apply specific commit(s) to current branch
git cherry-pick abc123
git cherry-pick abc123 def456
git cherry-pick -n abc123           # stage without committing
```

---

## 10. Tags & Releases

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended for releases)
git tag -a v1.0.0 -m "Release 1.0.0"
git tag -a v1.0.0 abc123            # tag specific commit

git push origin v1.0.0
git push origin --tags

# Delete tag
git tag -d v1.0.0
git push origin --delete v1.0.0
```

**Semantic Versioning:** `MAJOR.MINOR.PATCH` — breaking, feature, fix.

---

## 11. Git Hooks

Located in `.git/hooks/` or managed via Husky.

```bash
# pre-commit: lint, format, type-check
#!/bin/sh
npm run lint-staged

# commit-msg: validate conventional commits
#!/bin/sh
npx commitlint --edit $1

# pre-push: run tests
#!/bin/sh
npm test
```

**Husky setup:**
```bash
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

---

## 12. Monorepo & Submodules

### Submodules

```bash
git submodule add https://github.com/org/lib.git libs/lib
git submodule update --init --recursive
git clone --recurse-submodules url
```

### Monorepo (common in JS)

- Turborepo, Nx, Lerna for multi-package repos
- Single repo, shared CI, atomic cross-package changes

---

## 13. GitHub Workflow

### Pull Request Checklist

1. Create feature branch from `main`
2. Make focused commits with clear messages
3. Push branch, open PR with description
4. Link issue: `Closes #42`
5. Request review, address feedback
6. Ensure CI passes
7. Squash merge or merge commit per team policy
8. Delete branch after merge

### PR Template

```markdown
## Summary
- What changed and why

## Test plan
- [ ] Unit tests pass
- [ ] Manual testing steps

## Screenshots (if UI)
```

### Code Review Etiquette

- Review code, not the person
- Ask questions, suggest alternatives
- Approve when ready; request changes when blocking
- Keep PRs small (< 400 lines ideal)

---

## 14. Troubleshooting

```bash
# "Your branch and origin/main have diverged"
git pull --rebase origin main

# Accidentally committed to main
git branch backup-main
git reset --hard origin/main
git checkout -b feature/fix
git cherry-pick backup-main

# Large file committed (use Git LFS)
git lfs install
git lfs track "*.psd"
git add .gitattributes

# Clean untracked files
git clean -fd                       # dry run: git clean -fdn

# Bisect — find breaking commit
git bisect start
git bisect bad                      # current is broken
git bisect good v1.0.0              # this version worked
# test, then git bisect good/bad until found
git bisect reset
```

---

## 15. Interview Q&A

**Q: Difference between merge and rebase?**
A: Merge combines histories with a merge commit; rebase replays commits linearly. Merge preserves context; rebase creates cleaner history but rewrites commits.

**Q: What is a detached HEAD?**
A: HEAD points directly to a commit instead of a branch. New commits aren't on any branch until you create one with `git switch -c rescue`.

**Q: How do you undo a pushed commit?**
A: Use `git revert` to create a new commit that undoes changes. Avoid `reset --hard` + force push on shared branches.

**Q: What is `git fetch` vs `git pull`?**
A: Fetch downloads remote changes without merging. Pull = fetch + merge (or rebase with `--rebase`).

**Q: Explain fast-forward merge.**
A: When target branch hasn't diverged, Git moves the pointer forward without a merge commit.

**Q: What is `.gitignore` vs `.git/info/exclude`?**
A: `.gitignore` is shared in repo; `exclude` is local-only, not committed.

**Q: How do you resolve merge conflicts in a large team?**
A: Communicate ownership, pull frequently, use small PRs, run merge tools (`git mergetool`), agree on conflict resolution in code review.

**Q: What is git stash used for?**
A: Temporarily save uncommitted work to switch branches without committing incomplete changes.

**Q: Difference between `git reset --soft`, `--mixed`, `--hard`?**
A: Soft keeps staged + working; mixed (default) keeps working only; hard discards everything.

**Q: What is cherry-pick?**
A: Apply a specific commit from one branch onto another without merging entire branch.

---

## 16. Practice Resources

| Resource | URL | Focus |
|----------|-----|-------|
| Learn Git Branching | [learngitbranching.js.org](https://learngitbranching.js.org) | Interactive visual |
| Pro Git Book | [git-scm.com/book](https://git-scm.com/book/en/v2) | Official reference |
| GitHub Skills | [skills.github.com](https://skills.github.com) | Hands-on labs |
| Atlassian Git Tutorials | [atlassian.com/git/tutorials](https://www.atlassian.com/git/tutorials) | Workflows |
| Oh Shit Git | [ohshitgit.com](https://ohshitgit.com) | Recovery scenarios |

### Practice Exercises

1. Create repo, make 5 commits, use `git log --oneline --graph`
2. Create two branches with conflicting edits, resolve merge conflict
3. Rebase feature branch onto main, squash commits with `-i`
4. Use stash to switch branches mid-work
5. Fork a repo, add upstream, sync, submit PR
6. Use reflog to recover "lost" commit after hard reset
7. Set up Husky pre-commit hook with lint-staged
8. Tag a release and push tags to remote

---

## Quick Reference Card

```bash
git status | diff | log --oneline --graph
git add -p | commit -m "type: msg" | push
git branch | switch -c | merge | rebase
git fetch | pull --rebase | push -u
git restore | reset | revert | reflog
git stash | cherry-pick | tag
```

**Remember:** Commit often, push daily, pull before push, never force push to main.
