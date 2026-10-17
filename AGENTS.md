# Repository Guidelines

## Project Structure & Module Organization
- The site uses Zola 0.23.6; configuration lives in `zola.toml`.
- `content/` defines page and section metadata using Markdown front matter.
- `data/*.toml` holds Works, personal projects, and external blog links.
  Templates load these files explicitly; the directory is not published.
- `templates/` contains Tera 2 HTML templates, `partials/` for shared layout,
  and `components/` for reusable UI. Use Tera 2 components, not Tera 1 macros.
- `static/` contains CSS, JavaScript, images, icons, and favicons copied to output.
- Generated output goes to `public/` and is not committed.
- `PLAN_zola.md` tracks migration progress; `REVIEW_zola.md` records validation.
- Legacy Lume source, CMS configuration, and Deno configuration were removed
  with user approval. Use Git history for pre-migration comparison or rollback.

## Build, Test, and Development Commands
- `zola serve --extra-watch-path data`: serve locally with data live reload.
- `zola check`: validate site content and Markdown links.
- `zola build`: build the production site into `public/`.
- Zola is the only required site build tool. Keep local and CI versions aligned.

## Coding Style & Naming Conventions
- Use 2-space indentation in HTML and CSS; preserve existing class names and
  responsive styles when changing layout.
- Use Tera 2 syntax for templates and components; do not add JSX tooling.
- Keep dates in data as quoted `YYYY-MM-DD` strings. Omit `endDate` for ongoing
  work. Preserve description newlines and existing fields.
- `works.toml` uses `list` for display. The unused legacy `works` array and test
  `title` were removed with user approval; do not restore them for new entries.
- Keep data strings escaped as text. Do not apply `safe` indiscriminately.
- No dedicated formatter is required; keep TOML and HTML consistent with nearby
  code. Do not add build dependencies solely for formatting.

## Testing Guidelines
- There is no permanent automated test suite.
- Run `zola check` and `zola build` for changes, then verify affected pages.
- For visual changes, compare `/` and `/blogs/` in the browser at desktop and
  mobile widths, including the 600px responsive breakpoint.
- Check generated links and local assets manually: `zola check` does not inspect
  external links inside templates or loaded data.
- Confirm data edits trigger rebuilds using `--extra-watch-path data`.

## Commit & Pull Request Guidelines
- Recent commit messages are short, lowercase, and single-word (e.g., `chore`,
  `update`). Follow that pattern unless the team agrees otherwise.
- PRs should include a brief description, affected pages, relevant context,
  validation results, and screenshots for visual changes.
- PR CI checks/builds without deploying. Pushes to `main` publish to Pages.
- PR creation and CI configuration approval do not authorize merging the PR
  or publishing the site. Follow the user's explicit publishing instructions.

## Security & Configuration Tips
- Before introducing CI Actions/tools or changing how they are obtained, present
  the publisher, source, pinned version, and verification method to the user and
  obtain approval. Prefer GitHub-owned `actions/*` and upstream official sources.
  Do not treat popularity or an official publisher as a guarantee of safety.
- Approved CI setup: GitHub-owned `actions/checkout`, `actions/configure-pages`,
  `actions/upload-pages-artifact`, `actions/deploy-pages`, and
  `actions/upload-artifact`, directly referenced using full commit SHAs.
- `.github/scripts/install-zola.sh` installs Zola 0.23.6 from its official
  `getzola/zola` release on Ubuntu x86_64 and verifies a fixed SHA-256 before
  extraction/execution. Keep the version and checksum aligned when updating.
- CI build/check jobs have `contents: read`; Pages write and OIDC permissions
  are limited to the deployment job. Do not add third-party installer Actions.
- Retain `https://sukemaru.net` as `base_url` and the existing Pages custom domain,
  DNS, and HTTPS settings during migration.
- GA4 is included in production builds and omitted by `zola serve`.
- Favicons and SVGs are committed static assets; Lume plugins are not needed
  to generate them during Zola builds.
- Keep credentials out of source and generated output.
