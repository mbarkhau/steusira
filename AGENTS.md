# Agent Guidelines

## Language

Ideally language should be Simplified Technical English (STE).

Avoid contractions "it's", "don't", "won't", etc.
Avoid "too", prefer "also".

Avoid possessive 's.
- Avoid "the caller's scope". Instead prefer "the scope of the caller".
- Avoid "that candidate's parameter order". Instead prefer "the parameter order of that candidate".
- Avoid "do not pull a nested named call's setup before those evaluations". Instead prefer "do not pull the
  setup of a nested named call before those evaluations"

Avoid present continuous -ing form in favour of present simple forms.
- Avoid "Simply deleting the names is not the same". Instead prefer "It is not the same to simply delete the
  names."

Prefer more/less rather than adjectives/adverbs/qualifiers with -er.
- Avoid "I could not be clearer". Instead prefer "I could not be more clear".
- Avoid double negation. Prefer "more clear" instead of "less unclear". Prefer "less vague" instead of
  "more unclear".

These are not strict rules, just preferences. They are intended to make text more clear and should not be
adhered to at the expense of clarity.


## Markdown Formatting

Some rules for writing markdown files.

- The last paragraph, list or code block in a section, has two empty lines before the next heading.
- Two adjacent headings are only separated by one empty line.
- Wrap paragraphs at 110 characters.


## Abbreviations and Jargon

- ack!: I acknowledge and approve either all recommendations, or only those mentioned after the "ack!".
- plan!: Create or update a plans file based on what was acknowledged and/or decided.
- go!: Proceed with implementation of the plans/ file referenced most recently in conversation.


## Git Workflow: One Worktree per Agent Session

Agents do not work directly in the main checkout. The main checkout belongs to the user: do not edit files in
the main checkout, and do not run git commands in the main checkout that modify the working tree, the index,
or existing branches (no `stash`, `checkout`, `reset`, `commit`, `rebase`, or `push`).

Allowed git operations in the main checkout:
- `git worktree add -b "agent/<session>" ...` to create a dedicated agent session workspace.
- `git merge --ff-only agent/<branch>` only after explicit confirmation from the user. A confirmation
  applies to one merge. If the merge is not a fast-forward, stop and report it; do not use another merge form.

Worktree isolation is the safeguard, not rule enforcement.

- **Session workspace.** Before any file changes, create a new worktree and a new feature branch from the
  default branch (such as `origin/main` or `origin/master`). Use a unique session identifier in both names,
  for example `task-name-<unique-id>`. Place worktrees under `../<project>-workspaces/`, next to the
  main checkout.
- **Exclusive ownership.** A session owns only its assigned worktree and branch. Never claim an existing
  directory based on its branch, a clean status, or apparent inactivity. Branch checks are not locks.
  If creation fails because a path or branch exists, choose a new identifier; do not reuse or remove the
  existing workspace. A launcher can create the worktree before the agent starts. Use such a workspace
  only when explicitly assigned to this session. Resume another session only with permission from the user.
- **Commands and commits.** Run all edits, tests, and commits in the assigned worktree. Use explicit
  working directories for shell commands. Worktrees have separate files and indexes, but share Git refs and
  Git configuration. Do not change shared configuration, do not use the shared stash, and do not alter
  branches or worktrees owned by other sessions. Keep test outputs and temporary files local to the session;
  avoid shared fixed paths and ports.
- **Concurrent integration.** Before the final version and changelog update, fetch `origin` and rebase
  only the session branch onto the updated upstream base branch. Coordinate version allocation and merge order
  with the user or coordinating agent: a rebase alone does not reserve a build number. If another change
  merges first, rebase and check the version again before delivery. Worktree isolation prevents file
  interference, but does not prevent conflicting changes to the same code.
- **Delivery.** When work is complete, notify the user with the branch name `agent/<session>`. The user or
  the agent (with confirmation from the user) integrates the changes into the main checkout with
  `git merge --ff-only agent/<session>`. Leave the worktree and branch available for review; remove them only
  with permission from the user.

Example setup (replace the absolute path and session identifier before use; stop if any command fails):

```bash
MAIN=/absolute/path/to/<project>
SESSION="task-name-<unique-id>"
WORKSPACE="$(dirname "$MAIN")/<project>-workspaces/$SESSION"
BASE_BRANCH="origin/main"  # or origin/master, or HEAD

git -C "$MAIN" worktree add -b "agent/$SESSION" "$WORKSPACE" "$BASE_BRANCH"
```

Paths in this example are absolute so that commands do not depend on the initial working directory.


## Versions, Plans, and Changelog

- The project version is the canonical version of the software. Inspect the project version before work
  starts.
- Use `YYYY.BUILD`: a four-digit calendar year and a five-digit build number. Start at `10000` each year, then
  increment by one for each completed change (feature, fix, or behavior change). Do not derive the version at
  runtime. Documentation-only changes and new proposals do not require a version increment.
- When a new `plans/*.md` file is written, add `Baseline version: YYYY.BUILD` below its title. This is the
  version against which the original plan was written. Preserve it when the plan is revised or implemented.
  Record a separate version for later reevaluations if relevant.
- When a new plan is prepared, assess whether prerequisite features or foundational support must be
  implemented first, either as a requirement or because they make implementation substantially easier. When
  this is useful, suggest to the user one or more separate `plans/*.md` files for that prerequisite work.
  Explain the benefit and recommended implementation order, distinguish required dependencies from optional
  improvements, and link any prerequisite plans that already exist. Do not create extra plans for trivial or
  unrelated work.
- After a prerequisite plan is implemented, update the dependent `plans/*.md` files to reflect the
  available support. Revise implementation steps and dependency status as needed, link the implemented
  prerequisite, and record the version used for this reevaluation without changing the original baseline
  version.
- When asking for feedback, start with two lines, leading with "ELI5:" and "Recommend:", before the more
  elaborate explanation.
- Plans that predate version tracking have an unrecorded original baseline. Do not invent historical versions
  or label their original baseline as the current version. The initial tracked baseline is `2026.10000`.
- When a plan is implemented, increment the version and add an entry under that exact version in
  `CHANGELOG.md` (newest version first). Summarize the delivered changes, link the plan, and record validation
  results. Add `Implemented in: YYYY.BUILD` to the plan. For partial delivery, identify the completed stages
  and their versions; do not mark pending work as implemented.
- Record changes without a plan in `CHANGELOG.md` as well. Keep the canonical version, changelog heading, and
  implementation records consistent. Check the current version again before the final update so concurrent
  work does not reuse a build number. Never renumber historical entries.
- If more than 9 decisions are needed, the scope is too big and multiple plans should be generated.
- Decision/Proposal identifiers: D1231. The prefix "D" is fixed. The next three digits are unique per set of
  decisions/proposals in a plan or response. The last digit is for the proposal enumeration in one plan or
  response. If it is clear from the context, D1 just refers to the first decision from the recent plan or
  response.


## Key References

- **Change History**: `CHANGELOG.md`
- **Plans**: `plans/*.md`
