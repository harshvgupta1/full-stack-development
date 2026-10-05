# Product Company Interview Bank — Git Version Control (50 Questions)

> **Target companies:** Google, Meta, Microsoft, Amazon, Adobe, Atlassian, Uber, Flipkart, Salesforce, Stripe
> **Rule:** Full terms only — no unexplained abbreviations. Write for absolute beginners who know nothing.

---

### Question 1: What is Git, and why do product companies use it?
**Answer:** Git is a distributed version control system that records every change to your project files over time. Product companies use Git because many engineers can work on the same codebase in parallel without overwriting each other’s work. Git keeps a complete history of changes, makes code review possible before release, and allows teams to roll back broken changes quickly. At companies like Google or Amazon, Git (or Git-based tools) sits at the center of daily development, continuous integration, and deployment pipelines.

### Question 2: What is the difference between Git and GitHub?
**Answer:** Git is the version control software that runs on your computer and tracks file history locally. GitHub is a cloud hosting service built on top of Git that stores repositories remotely and adds collaboration features like pull requests, issue tracking, and access control. You can use Git entirely offline on your machine; GitHub requires an internet connection to sync and collaborate. Think of Git as the engine and GitHub as a garage where teams park and share their projects.

### Question 3: What happens when you run `git init`?
**Answer:** The command `git init` creates a new Git repository in your current folder by adding a hidden `.git` directory. That directory stores all commits, branches, tags, and configuration for the project. After initialization, Git starts tracking changes only after you explicitly add files with `git add`. Running `git init` does not connect to any remote server; it only sets up local version control.

### Question 4: Explain the three areas in Git: working directory, staging area, and repository.
**Answer:** The working directory is where you edit files on disk. The staging area (also called the index) is a middle layer where you place changes you intend to include in the next commit. The repository is the stored history of committed snapshots inside the `.git` folder. A typical flow is: edit files in the working directory, use `git add` to stage them, then use `git commit` to save them permanently in the repository.

### Question 5: What is a commit, and what information does it contain?
**Answer:** A commit is a saved snapshot of your project at a specific point in time. Each commit contains a unique identifier (a 40-character hash), a pointer to its parent commit, the author name, the author email, a timestamp, and a commit message describing the change. Commits are immutable once created; you do not edit old commits—you create new ones. Good commit messages at product companies explain *why* a change was made, not just *what* changed.

### Question 6: What does `git status` tell you?
**Answer:** The command `git status` shows the current state of your working directory and staging area relative to the last commit. It lists untracked files (new files Git has never seen), modified files not yet staged, and staged files ready to commit. It also tells you which branch you are on and whether it is ahead of or behind the remote branch. Engineers run `git status` constantly before committing to avoid surprises.

### Question 7: What is the difference between `git add .` and `git add -p`?
**Answer:** The command `git add .` stages all new and modified files in the current directory and subdirectories at once. The command `git add -p` (patch mode) lets you review each change hunk by hunk and choose which parts to stage. Patch mode is preferred at product companies when a single file contains multiple unrelated changes that should become separate commits. Smaller, focused commits make code review and bug investigation much easier.

### Question 8: How do you write a good commit message?
**Answer:** A good commit message has a short summary line (under 50–72 characters) in imperative mood, such as “Fix login timeout on slow networks.” Optionally add a blank line and a longer body explaining motivation, approach, and trade-offs. Avoid vague messages like “fix bug” or “update stuff.” At Stripe or Salesforce, reviewers often reject pull requests whose commit messages do not explain the business or technical reason for the change.

### Question 9: What is a branch in Git?
**Answer:** A branch is a movable pointer to a specific commit, allowing parallel lines of development within the same repository. The default branch is usually named `main` or `master`. When you create a branch, Git copies the pointer so you can make commits without affecting other branches. Branches are cheap in Git—they are just small reference files, not full copies of your codebase.

### Question 10: How do you create and switch to a new branch?
**Answer:** Create a branch with `git branch feature-name`, which adds the pointer but does not switch to it. Switch with `git checkout feature-name` or use the combined command `git checkout -b feature-name` to create and switch in one step. Modern Git also supports `git switch -c feature-name` for the same purpose. At product companies, branches are typically named after ticket numbers or features, such as `JIRA-1234-add-payment-retry`.

### Question 11: What is the difference between `git merge` and `git rebase`?
**Answer:** Merge combines two branch histories by creating a new merge commit that has two parents, preserving the exact timeline of when work happened. Rebase replays your commits on top of another branch’s tip, producing a linear history without a merge commit. Merge is safer for shared branches because it does not rewrite history. Rebase keeps history clean but must never be used on commits already pushed and shared with teammates unless the team explicitly agrees.

### Question 12: When would you choose merge over rebase in a product team?
**Answer:** Choose merge when integrating feature branches into a shared main branch, especially if multiple people worked on the feature branch or if the branch was already pushed publicly. Merge preserves the original commit timestamps and makes it clear when integration happened. Most companies require merge (or squash merge via the hosting platform) for pull requests into protected main branches. Rebase is typically reserved for cleaning up your own local commits before opening a pull request.

### Question 13: What is a merge conflict, and why does it happen?
**Answer:** A merge conflict occurs when Git cannot automatically combine changes because two commits modified the same lines in the same file differently. Git stops the merge and marks the conflicting sections in the file with markers like `<<<<<<<`, `=======`, and `>>>>>>>`. Conflicts are normal when two engineers edit the same code region. They are not errors—they are Git asking a human to decide the correct final content.

### Question 14: Walk through resolving a merge conflict step by step.
**Answer:** First, run `git status` to see which files conflict. Open each conflicted file and find the conflict markers. Edit the file to keep the correct code and remove all markers. Save the file, then run `git add filename` to mark it resolved. After all conflicts are fixed and staged, run `git commit` (or `git merge --continue` if a merge was in progress). Finally, run tests locally before pushing, because conflict resolution can accidentally drop logic from either side.

### Question 15: What does `git cherry-pick` do, and when is it used?
**Answer:** Cherry-pick applies the changes from a specific commit onto your current branch as a new commit with a different identifier. It is used when you need one fix from another branch without merging the entire branch. For example, a critical bug fix landed on the main branch and must also go to a release branch. Use cherry-pick carefully—if the original commit depends on earlier commits, cherry-picking may cause new conflicts or broken builds.

### Question 16: What is `git stash`, and when should you use it?
**Answer:** Stash temporarily saves uncommitted changes (both staged and unstaged) and reverts your working directory to a clean state matching the last commit. Use it when you must switch branches urgently but your current work is not ready to commit. Restore stashed work with `git stash pop` (apply and remove) or `git stash apply` (apply but keep the stash). At busy product teams, stash is common when a production incident interrupts feature development.

### Question 17: What is the difference between `git reset`, `git revert`, and `git restore`?
**Answer:** `git reset` moves the current branch pointer backward and can discard commits from branch history (dangerous on shared branches). `git revert` creates a new commit that undoes a previous commit’s changes, preserving history—this is the safe choice on shared main branches. `git restore` (modern Git) discards uncommitted changes in the working directory or unstages files without rewriting commit history. On protected main branches at Amazon or Microsoft, revert is almost always preferred over reset.

### Question 18: Explain soft, mixed, and hard reset.
**Answer:** `git reset --soft HEAD~1` moves the branch pointer back one commit but keeps changes staged—useful for redoing a commit message. `git reset --mixed HEAD~1` (the default) moves the pointer back and unstages changes, but files remain modified in the working directory. `git reset --hard HEAD~1` moves the pointer back and discards all uncommitted changes permanently. Hard reset is destructive and should never be used on commits that teammates rely on.

### Question 19: What is the reflog, and why is it a lifesaver?
**Answer:** The reflog (reference log) records every movement of branch pointers and HEAD in your local repository, including resets, rebases, and checkouts. Even if you accidentally run a hard reset and “lose” commits, `git reflog` shows the old commit identifiers so you can recover them with `git checkout` or `git reset --hard` to that identifier. Reflog entries expire after a default period (usually 90 days). It is local only—there is no reflog on the remote server for other people’s machines.

### Question 20: How do remotes work in Git?
**Answer:** A remote is a named reference to another copy of the repository, usually on a server like GitHub or GitLab. The default remote is typically named `origin`. You fetch updates with `git fetch origin`, which downloads new commits without changing your working files. You push your commits with `git push origin branch-name`, which uploads your local branch to the remote. Remotes enable collaboration: each engineer has a full local copy and syncs through the shared remote.

### Question 21: What is the difference between `git fetch`, `git pull`, and `git push`?
**Answer:** `git fetch` downloads new commits and branch updates from the remote but does not merge them into your current branch—you inspect first, then merge manually. `git pull` is fetch plus merge (or fetch plus rebase if configured) in one command—it updates your current branch immediately. `git push` uploads your local commits to the remote branch. At product companies, some teams prefer `git fetch` followed by explicit merge or rebase so pulls never surprise you with automatic merges.

### Question 22: What is a pull request, and how does the review flow work?
**Answer:** A pull request (also called a merge request on GitLab) is a formal proposal to merge your branch into a target branch like `main`. You push your branch, open the pull request on GitHub or GitLab, and request reviewers from your team. Reviewers leave comments, request changes, or approve. Continuous integration checks run automatically on the pull request. Once approved and checks pass, the branch is merged—often with squash merge to keep main history clean.

### Question 23: What is a protected branch, and why do companies use them?
**Answer:** A protected branch is a branch (usually `main` or `production`) with rules enforced by the hosting platform. Rules commonly include: no direct pushes, required pull request approvals, required passing tests, and required signed commits. Protected branches prevent accidental force pushes and untested code from reaching production. At Flipkart or Uber, pushing directly to main is blocked—every change must go through the pull request pipeline.

### Question 24: What is force push, and when is it dangerous?
**Answer:** Force push (`git push --force`) overwrites the remote branch history with your local history, discarding commits that exist on the remote but not locally. It is dangerous on shared branches because teammates’ work can vanish from the remote history. Force push is occasionally acceptable on your own feature branch after a local rebase, often using the safer `git push --force-with-lease` which fails if someone else pushed in the meantime. Never force push to main or any branch others are actively using.

### Question 25: What does `git clone` do compared to `git fork`?
**Answer:** `git clone` creates a full local copy of a repository on your machine, including all branches and history. A fork (on GitHub or GitLab) creates your own copy of someone else’s repository under your account on the server—you then clone your fork locally. Forking is standard for open-source contributions where you do not have write access to the original repository. You push to your fork and open a pull request back to the original project.

### Question 26: What is `.gitignore`, and what should you put in it?
**Answer:** The `.gitignore` file lists file and folder patterns that Git should never track. Common entries include dependency folders (`node_modules/`), build output (`dist/`, `build/`), environment files (`.env`), operating system files (`.DS_Store`), and log files. Ignoring secrets and generated artifacts keeps repositories clean and prevents accidental credential leaks. At product companies, committing secrets to Git is a serious security incident—`.gitignore` is the first line of defense, not the only one.

### Question 27: How do you remove a file from Git history that was committed by mistake?
**Answer:** If the file was just committed locally and not pushed, you can use `git reset` or amend the commit to remove it, then add the file to `.gitignore`. If it was already pushed—especially if it contains secrets—you must treat it as a security incident: rotate the exposed credentials immediately and use tools like `git filter-repo` or BFG Repo-Cleaner to purge the file from all history. Simply deleting the file in a new commit does not remove it from old commits that attackers can still read.

### Question 28: What are Git tags, and how do they differ from branches?
**Answer:** Tags are permanent pointers to specific commits, typically used to mark release versions like `v1.0.0` or `v2.3.1`. Unlike branches, tags do not move forward as you make new commits—they stay fixed on one commit forever. Lightweight tags are simple names; annotated tags store extra metadata like tagger name, date, and message. Product teams tag releases so operations and support can always check out the exact code that is running in production.

### Question 29: How do you create and push an annotated tag for a release?
**Answer:** Create an annotated tag with `git tag -a v1.0.0 -m "Release version 1.0.0"`. Push it to the remote with `git push origin v1.0.0` or push all tags with `git push origin --tags`. Annotated tags are preferred for releases because they include metadata and are cryptographically signable. Release pipelines at companies like Adobe often trigger automatically when a version tag matching a pattern (such as `v*.*.*`) is pushed.

### Question 30: What are Git hooks, and give examples used in product teams?
**Answer:** Git hooks are scripts that run automatically at specific Git events, such as before a commit or before a push. A `pre-commit` hook might run a linter or formatter to block commits with style violations. A `commit-msg` hook might enforce a message format like `JIRA-1234: description`. A `pre-push` hook might run unit tests locally before code reaches the remote. Teams often manage hooks through tools like Husky (for JavaScript projects) or pre-commit (for Python) so hooks are shared via the repository.

### Question 31: What is `git bisect`, and how does it help debug regressions?
**Answer:** Git bisect performs a binary search through commit history to find the exact commit that introduced a bug. You mark a known good commit as `git bisect good` and a known bad commit as `git bisect bad`, then Git checks out the middle commit for you to test. You repeat marking good or bad until Git identifies the first bad commit. At Meta-scale codebases, bisect saves hours compared to manually checking every commit between two release points.

### Question 32: What is a submodule, and when would a team use one?
**Answer:** A submodule embeds one Git repository inside another as a subdirectory, pinned to a specific commit of the inner repository. Teams use submodules when a shared library lives in its own repository but must be included at an exact version inside a larger project. The parent repository stores a pointer to the submodule commit, not the submodule’s full history. Submodules add complexity—every clone requires `git submodule update --init --recursive`—so many teams prefer package managers or monorepos instead.

### Question 33: What is a monorepo, and how does Git support it?
**Answer:** A monorepo is a single Git repository containing multiple projects, services, or packages instead of many separate repositories. Git supports monorepos natively because branches, tags, and history work the same regardless of repository size. Challenges include slow clones, noisy commit history across unrelated teams, and expensive continuous integration. Companies like Google and Meta use monorepos with custom tooling (partial clones, sparse checkout, affected-target testing) to keep workflows manageable at scale.

### Question 34: What is sparse checkout in Git?
**Answer:** Sparse checkout lets you clone or check out only specific directories from a large repository instead of the entire tree. This reduces disk usage and speeds up operations in monorepos where you only work on one service. Enable it with `git sparse-checkout init --cone` and specify folders with `git sparse-checkout set path/to/folder`. Sparse checkout is increasingly important as monorepos grow—engineers at Microsoft and Google rely on it daily.

### Question 35: What is the difference between squash merge and regular merge in a pull request?
**Answer:** Regular merge preserves every commit from the feature branch and adds a merge commit connecting the histories. Squash merge combines all feature branch commits into a single new commit on the target branch, discarding individual commit messages except the squash summary. Squash merge keeps main branch history linear and readable—one pull request equals one commit. Many product companies enforce squash merge on main so bisect and revert operations map cleanly to one pull request.

### Question 36: How do you undo the last commit that was already pushed to a shared branch?
**Answer:** Use `git revert HEAD` to create a new commit that reverses the last commit’s changes, then push normally—no force push needed. If you must revert an older commit, use `git revert <commit-hash>`. Revert is safe because it adds history instead of deleting it, so teammates’ clones stay compatible. Reset and force push on shared branches is almost never acceptable at product companies and may violate compliance policies.

### Question 37: You ran `git pull` and got a merge conflict. What do you do?
**Answer:** Do not panic—run `git status` to list conflicted files. Open each file, resolve conflict markers manually, and save. Stage resolved files with `git add`. Complete the merge with `git commit` (Git pre-fills a merge commit message). Run your test suite to verify nothing broke during resolution. If the conflict is too messy, you can abort with `git merge --abort` to return to the pre-pull state and ask the teammate who owns the conflicting code for help.

### Question 38: What is `git blame`, and how should you use it professionally?
**Answer:** `git blame` (or `git annotate`) shows who last modified each line of a file and in which commit. It helps trace when a bug was introduced and who to ask for context. Use it for investigation, not for assigning public blame—many teams prefer the neutral term `git log -L` or hosting-platform “blame” views. At code review, blame helps you understand whether a suspicious line is legacy code or a recent regression.

### Question 39: What is a detached HEAD state, and how do you fix it?
**Answer:** Detached HEAD means Git’s HEAD pointer sits directly on a commit rather than on a branch name—common after checking out a specific tag or commit hash. Commits made in detached HEAD are not attached to any branch and can become unreachable once you switch away. Fix it by creating a branch: `git switch -c rescue-branch` before making commits, or switch back to an existing branch with `git switch main`. Always check `git status`—it warns you when HEAD is detached.

### Question 40: Explain the typical Git workflow for a feature from start to merge.
**Answer:** Sync main with `git pull origin main`, then create a feature branch with `git switch -c feature/add-search`. Make small commits with clear messages, pushing regularly with `git push -u origin feature/add-search`. Open a pull request, address review comments with additional commits, and wait for continuous integration to pass. After approval, squash merge into main on the hosting platform, delete the feature branch, and pull the updated main locally. This trunk-based or GitHub-flow pattern is standard at Stripe, Salesforce, and most product companies.

### Question 41: What is signing commits, and why do some companies require it?
**Answer:** Commit signing uses a cryptographic key (GPG or SSH) to prove that a commit was actually created by the claimed author. GitHub and GitLab display a “Verified” badge on signed commits. Companies require signing to prevent impersonation and to meet supply-chain security standards. Configure it once with `git config commit.gpgsign true` and upload your public key to your hosting account. Unsigned commits on protected branches may be rejected automatically.

### Question 42: What is the difference between GitLab merge requests and GitHub pull requests?
**Answer:** Functionally they are the same concept—proposing to merge one branch into another with code review and automation. GitHub calls them pull requests; GitLab calls them merge requests. GitLab often integrates merge request approvals, environments, and deployment tracking in one interface. GitHub relies heavily on Actions for continuous integration and third-party apps. Interviewers may ask this to check whether you understand that the workflow is universal even if the product names differ.

### Question 43: How do you compare changes between branches or commits?
**Answer:** Use `git diff main..feature-branch` to see all code differences between two branches. Use `git diff HEAD~1` to compare the last commit with its parent. Use `git log main..feature-branch` to list commits on the feature branch that are not yet on main. On GitHub, the pull request “Files changed” tab shows the same diff visually. Before merging, reviewers rely on diffs to catch unintended changes, deleted tests, or missing migrations.

### Question 44: What is `git clean`, and when would you use it?
**Answer:** `git clean` removes untracked files and directories from the working directory—files Git is not managing at all. Use `git clean -fd` to delete untracked files and folders after confirming you do not need them (dry run first with `git clean -n`). This is useful when build artifacts clutter the tree and `.gitignore` missed them, or when switching experiments. It does not remove tracked files; use `git restore` or `git reset` for those.

### Question 45: How do you handle a situation where your feature branch is many commits behind main?
**Answer:** First, fetch latest main with `git fetch origin main`. Then either merge main into your branch with `git merge origin/main` (preserves history, adds a merge commit) or rebase onto main with `git rebase origin/main` (linear history, rewrites your commits). After rebase, you must force push your feature branch with `--force-with-lease`. Resolve any conflicts during merge or rebase, run tests, and push. Keeping branches updated reduces painful mega-conflicts on pull request merge day.

### Question 46: What are common mistakes junior engineers make with Git in interviews?
**Answer:** Committing secrets or large binary files, force pushing to shared branches, making giant commits that mix unrelated changes, and using hard reset on pushed work. Another mistake is rebasing commits that teammates already pulled, which duplicates work and confuses history. Interviewers also watch for inability to explain merge versus rebase trade-offs or not knowing how to recover from a bad reset using reflog. Demonstrating calm conflict resolution and revert-over-reset judgment signals mid-level readiness.

### Question 47: How does Git integrate with continuous integration pipelines?
**Answer:** Continuous integration runs automated builds and tests on every push or pull request. Hosting platforms send webhooks to services like GitHub Actions, GitLab Continuous Integration, Jenkins, or CircleCI when code changes. The pipeline clones the repository at the pull request commit, installs dependencies, runs linters and tests, and reports pass or fail status back to the pull request. Merging is blocked until required checks pass. At Amazon and Microsoft, this gatekeeping is non-negotiable for production branches.

### Question 48: What is `git worktree`, and when is it useful?
**Answer:** `git worktree` lets you check out multiple branches simultaneously in separate directories linked to the same repository. Instead of stashing and switching, you can have `main` in one folder and `hotfix/bug` in another and work on both in parallel. This is useful when a production hotfix interrupts feature work—you fix the hotfix in the second worktree without disturbing uncommitted feature changes. Each worktree shares the same `.git` database but has its own working directory.

### Question 49: How would you explain Git to a teammate who keeps breaking the build with bad merges?
**Answer:** I would pair with them on a safer workflow: always pull latest main before starting work, make small commits, push the feature branch early, and open a draft pull request so continuous integration catches issues quickly. Teach them to run `git status` and tests before every push, use merge instead of rebase on shared branches until comfortable, and never force push to main. If they force pushed or reset badly, show them reflog recovery once—it builds confidence that Git is recoverable when used carefully.

### Question 50: A production bug exists in the latest release. How does Git help you hotfix it?
**Answer:** Check out the release tag (for example `v2.1.0`) or the release branch, create a hotfix branch with `git switch -c hotfix/payment-crash v2.1.0`, fix the bug, and commit. Open an urgent pull request, get expedited review, merge, and tag the new release (`v2.1.1`). Cherry-pick the fix onto main if it is not already there so the bug does not return in the next release. Git’s tags and branches let operations deploy an exact hotfix while feature development continues unaffected on main.
