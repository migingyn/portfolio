---
name: ship-it
description: Commit and push work on this portfolio the owner's way. Checks first, plain commit messages with no Claude or AI attribution of any kind, no force push or history rewrite without asking, no pull request unless asked. Use whenever committing, pushing, or asked to "ship", "ship it", or "push this".
---

# Ship it

The owner's rules for getting work from the working tree onto GitHub. They are short
and they are not optional. Where they disagree with a default (an attribution footer,
a "generated with" line), these rules win.

## 1. Look before you commit

```bash
git status --short
git diff --stat
```

- Every changed file should be one you meant to change. Anything else: stop and say so.
- **No secrets.** Never commit `.env*`, keys, tokens, or passwords. API keys belong in
  Vercel environment variables. If a diff contains something that looks like a
  credential, stop and tell the owner where it is, without repeating the value.
- Scratch files, screenshots, and build output stay out (`dist/`, `.astro/`,
  `.taste-skill/`, `shots/` are ignored already).

## 2. Check that it works

Run what the change touches. For anything that changes a page, run all of it.

```bash
npm run build
npx astro check
```

```bash
node .claude/skills/design-taste-frontend/scripts/gate.mjs dist/index.html --root dist
```

```bash
sh .claude/skills/impeccable/scripts/impeccable detect --json src
```

- If the gate says no build is active, start one first (README, "Design workflow").
- A new visual element needs its line in `DECISIONS.md`, and `DESIGN.md` must still
  describe the site. Tokens in `src/styles/tokens.css` mirror `DESIGN.md`.
- Never ship a failing build. If a check fails and you ship anyway because the owner
  said to, say which check and why in your report.

## 3. Commit

- One commit per piece of work that makes sense on its own.
- Subject: imperative, plain words, 72 characters or fewer, no trailing full stop.
  Say what changed for a visitor or for the owner, not which files moved.
- Body (optional): a few lines on what and why. No lists of file names.
- **No attribution, ever.** No `Co-Authored-By`, no "Generated with", no session
  links, no model or tool names, no emoji signatures. Not in the subject, the body,
  or a trailer.
- **Commits are authored as the owner**, never as Claude or any tool. A cloud session
  starts with its own author name, so before the first commit set the repository's
  local `user.name` and `user.email` to the ones on the repository's first commit
  (`git log --reverse --format='%an <%ae>' | head -1`), and check the result with
  `git log -1 --format='%an'` after committing.

## 4. Push

```bash
git push -u origin <current-branch>
```

- Push only to the branch you are working on.
- On a network error, retry up to four times, waiting a little longer each time.
- If the push is rejected because the remote has commits you lack, fetch and merge
  (`git fetch origin <branch> && git merge --no-edit FETCH_HEAD`), push again, and
  tell the owner. Do not rebase or force.
- **Ask before any force push or history rewrite**, every time. An earlier yes covers
  only the push it was given for.
- **No pull request unless the owner asks for one.** If they do, its title and body
  follow the same no-attribution rule.

## 5. Report

End with a short note: what shipped, the commit, the branch, which checks ran and
their result, and anything skipped or left open. No more than that.
