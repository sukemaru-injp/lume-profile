# Repository Guidelines

## Project Structure & Module Organization
- Site configuration lives in `_config.ts`; CMS setup is in `_cms.ts`.
- Source content and templates are in `src/`:
  - `src/_assets/` for static assets (images, fonts, etc.).
  - `src/_components/` for reusable UI components.
  - `src/_includes/` for layout and partial templates.
  - `src/posts/` for blog content.
  - `*.page.tsx` files (e.g., `src/index.page.tsx`) define pages.
- Generated output goes to `_site/`; cache artifacts are in `_cache/`.

## Build, Test, and Development Commands
- `deno task serve`: build and run the site locally with live reload.
- `deno task build`: build the production site into `_site/`.
- `deno task lume`: run the Lume CLI directly (useful for custom flags).
- `deno fmt`: format code according to repo settings.
- `deno lint`: run lint checks (uses Lume’s lint plugin).

## Coding Style & Naming Conventions
- Formatting is enforced by `deno fmt` with 2-space indentation, 80-column line width, semicolons, and double quotes.
- Use `.tsx` for page templates and component files.
- Name page entries with the `.page.tsx` suffix (e.g., `blogs.page.tsx`).
- Keep component and include names descriptive and kebab-free (e.g., `Hero.tsx`, `nav.tsx`).

## Testing Guidelines
- No automated test suite is currently present.
- For changes, validate by running `deno task serve` and manually verifying pages in the browser.
- If tests are added, document how to run them here and follow a `*.test.ts` naming convention under `src/`.

## Commit & Pull Request Guidelines
- Recent commit messages are short, lowercase, and single-word (e.g., `chore`, `update`). Follow that pattern unless the team agrees otherwise.
- PRs should include:
  - A brief description of changes and affected pages.
  - Linked issues or context when applicable.
  - Screenshots for visual or layout updates.

## Security & Configuration Tips
- Deno permissions are scoped in `deno.json`; update them only when required by new dependencies.
- Lume imports are pinned via CDN URLs in `deno.json`. Keep versions explicit when updating.
