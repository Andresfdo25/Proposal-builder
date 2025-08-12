# Contributing Guidelines – Proposal Builder

Welcome!
These guidelines keep contributions consistent, easy to review, and maintainable.

---

## 1. Branch Naming Convention

Format:
<type>/<short-description>

**Types**
| Type       | When to Use |
|------------|-------------|
| `feat`     | New feature or functionality |
| `fix`      | Bug fixes |
| `refactor` | Internal code improvements (no behavior change) |
| `style`    | UI/visual changes |
| `docs`     | Documentation only |
| `chore`    | Configs, tooling, deps |
| `test`     | Add/improve tests |

**Examples**
feat/pdf-export
style/scope-editor
fix/totals-rounding

---

## 2. Commit Message Format (Conventional Commits)
<type>(<scope>): <short description>

**Examples**
feat(scope): add "General Conditions" section
fix(pdf): correct logo alignment in print
refactor(ui): extract Button component

---

## 3. Workflow

1. From `main`:
git checkout main
git pull
git checkout -b feat/service-scope

2. Make changes and commit:
git commit -m "feat(scope): add service scope option"

3. Push
git push -u origin feat/service-scope
4. Open a Pull Request (PR) to main.
5. After review → Merge → Delete branch.

## 4. PR Guidelines
Keep PRs focused (one feature/fix).
Pass local checks: npm run typecheck (and npm run dev to test).
Add a clear description and screenshots if UI changes.
Link issues (if any).

Thanks for contributing!