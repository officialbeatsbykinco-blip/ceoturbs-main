# CLAUDE.md

## Git: one branch only

- Always commit and push directly to `main`. `main` is the branch Vercel deploys to the custom domain.
- Do not create feature branches or pull requests. If a session starts on another branch, bring `main` up to date with that work and push `main`.
- Before pushing, run `npx vitest run`, `npm run typecheck`, `npm run lint` and `npm run build`; push only when all pass.

## Safety net (do not rely on it)

- `.github/workflows/sync-claude-to-main.yml` merges any push to a `claude/**` branch into `main` after tests and build pass, so Vercel still deploys it.
- `vercel.json` turns off Vercel deployments for `claude/**` branches, so only `main` builds show up and nothing from a side branch can be promoted to production.
