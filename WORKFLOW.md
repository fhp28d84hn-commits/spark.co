# SPARK.CO — Workflow

## Code Delivery Process
1. Work is done on feature branches (e.g. `fix/nav-height`, `feat/animations`)
2. Push the branch and create a Pull Request to `main`
3. The lead reviews the PR and merges via `gh pr merge --squash`
4. Deploy to Vercel from the `main` branch

## Branch Naming
- `feat/` for new features
- `fix/` for bug fixes
- `style/` for visual/style changes
- `docs/` for documentation

## Commit Style
Conventional commits: `type: description` (e.g. `feat: add loader animation`)