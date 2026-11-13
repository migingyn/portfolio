# Vendored design skills

These are third-party agent skills copied into this repo so every Claude Code session
loads them. They are the project's design workflow (see DESIGN.md section 0):
taste-skill sets the build rules, Impeccable and Emil Kowalski's skills do the polish.
They are tooling only and are not part of the built site.

| Skill folder(s) | Source | Commit | Licence |
|---|---|---|---|
| `skills/design-taste-frontend` | github.com/Leonxlnx/taste-skill (`skills/taste-skill`) | f6b7657 | MIT |
| `skills/impeccable` | github.com/pbakaus/impeccable (`.claude/skills/impeccable`) | c4cd192 | Apache 2.0 |
| `skills/emil-design-eng` and 15 more (animate, animation-performance, animation-vocabulary, apple-design, break-ui, choreograph, find-animation-opportunities, gestures, improve-animations, learn-taste, mobile-native, pick-ui-library, prototype, remove-animations, review-animations) | github.com/emilkowalski/skill (`skills/`) | f7ce8c0 | MIT |

Copied on 2026-11-13. Licence texts are in `licenses/`. Not copied from Emil's set
because this project has no use for them: `animate-expo`, `ask-sonner`, `write-swift`.

Things to know:

- **Priority.** When a skill disagrees with the owner's brief or with DESIGN.md, the
  brief wins, then DESIGN.md, then the skill (DESIGN.md D-046).
- **taste-skill runs a checker when a session ends** (a Stop hook declared in its
  SKILL.md). It needs Node 22+ and Chrome, and writes its state to `.taste-skill/`.
- **Impeccable downloads its engine binary on first use** into `~/.impeccable/bin/`.
- **To update,** copy the same folders again from the source repos and change the
  commits above. Do not edit the files in place.
