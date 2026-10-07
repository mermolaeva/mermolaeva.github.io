# Agent Log

This file documents meaningful changes made with the help of Codex/agents.
Append new entries to the end of the file. Keep entries short and factual. Do not log brainstorming or abandoned ideas.
Human comments must go in clearly marked sections.

---

## YYYY-MM-DD HH:MM — Short Title

**Summary**
- 1–3 bullets describing what changed.

**Why**
- Brief motivation (bug fix, refactor, feature, cleanup, etc.).

**Validation**
- Exact command(s) to run.
- Short manual checklist (if applicable).

**Risks / Follow-ups**
- Known edge cases, tech debt created, or future improvements.

### Human Notes
- (Optional) Clarifications, objections, or context.
- May adjust interpretation of risks or next steps.

### Agent Follow-Up
- Agent may respond here if human notes require action.
- Keep concise.

---

## 2026-09-30 13:41 BST — Initial Repository Survey

**Summary**
- Reviewed the repository rules and documented the project structure: a Jekyll personal site built from root-level content and configuration on a vendored Minimal Mistakes 4.4.1 theme.
- Identified the main site areas (`index.md`, `_pages/`, `_data/`, and public assets), the theme implementation (`_layouts/`, `_includes/`, `_sass/`, and `assets/js/`), and the upstream-style `docs/` and `test/` fixtures excluded from the live site.
- Confirmed that the MG Constructor demo is a self-contained browser-side page backed by local grammar text files, while Ruby/Jekyll handles site builds and npm scripts rebuild the theme JavaScript bundle.

**Why**
- Establish an initial technical baseline for future changes without altering published content or build behavior.

**Validation**
- Documentation-only change; no site build was required.
- Review the appended entry with `tail -n 25 agent-log.md`.

**Risks / Follow-ups**
- The theme and declared Ruby/Node tooling are from an older dependency generation, and no dependency lockfile is present, so clean-environment builds may be sensitive to tool versions.
- `README.md` primarily documents the upstream theme rather than this site, and analytics is embedded in a custom head include independently of the main analytics configuration.

---

## 2026-09-30 15:10 BST — Minimal Mistakes 4.28.1 Migration

**Summary**
- Converted the site from a vendored theme fork to the pinned `mmistakes/minimal-mistakes@4.28.1` remote theme and its current configuration schema.
- Removed local theme layouts, includes, Sass internals, and JavaScript that would shadow upstream; retained the Academicons head hook and replaced the former Sass amalgam with a compact site-specific customization layer.
- Removed obsolete Universal Analytics and Google 404 helper code, modernized visible Font Awesome classes, and excluded repository-only agent/development files from the published site.

**Why**
- Make future theme updates small and auditable while preserving the site's content, navigation, MG Constructor, and established visual design.

**Validation**
- YAML and front matter parsed successfully with Ruby; all referenced local assets and MG Constructor grammar files were present; `git diff --check` passed.
- Run `bundle install`, then `bundle exec jekyll build --config _config.yml,_config_local.yml` and manually review the primary routes at desktop and mobile widths.

**Risks / Follow-ups**
- The new Ruby bundle is not installed yet, so the Jekyll build and visual parity check remain pending.
- The old upstream `docs/`, `test/`, and theme-development files remain excluded from the site; remove them after the migrated build is accepted.
- Correction to the initial survey: an ignored local `Gemfile.lock` existed, but no dependency lockfile is version-controlled.

---

## 2026-09-30 15:18 BST — Local Bundler Install Fix

**Summary**
- Removed the ignored pre-migration lockfile that pinned Bundler 1.17.3 and the old local theme gem.
- Documented a repository-local `vendor/bundle` install path and ignored that directory.

**Why**
- Bundler was attempting to write gems to the system-owned `/var/lib/gems/3.2.0` directory and could not complete without elevated permissions.

**Validation**
- Confirmed the stale lockfile is absent, local Bundler paths are ignored, and `git diff --check` passes.
- Run `bundle config set --local path vendor/bundle`, followed by `bundle install`.

**Risks / Follow-ups**
- Dependency installation and the Jekyll build remain pending.

---

## 2026-09-30 16:01 BST — Migration Build Validation

**Summary**
- Pinned the local GitHub Pages toolchain to version 232 and completed an isolated dependency installation under `vendor/bundle`.
- Added an ignored `_site_local` destination for local builds because the pre-existing `_site` directory is not owned by the current user.
- Successfully built the site with Minimal Mistakes 4.28.1 and smoke-tested the home page and MG Constructor at desktop and mobile sizes.

**Why**
- Confirm that the remote-theme migration builds and renders correctly without altering system-wide Ruby gems or the currently deployed site.

**Validation**
- `bundle check`
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Verified the expected routes and core assets, 123 generated internal references across seven HTML pages, current theme markup, retained custom styles, and absence of obsolete analytics scripts.

**Risks / Follow-ups**
- The build emits a non-fatal Faraday retry-middleware notice.
- The root-owned ignored `_site` directory remains untouched; local commands should use `_site_local`.
- The excluded legacy upstream `docs/`, `test/`, and theme-development files can be removed in a separate cleanup after review.

---

## 2026-09-30 16:20 BST — Sidebar Navigation Fix

**Summary**
- Removed the generated table-of-contents panels from the Projects and Teaching pages, leaving their existing left navigation as the only page navigation.
- Updated the left-navigation links to use each page's canonical trailing-slash URL so the upgraded theme recognizes them as same-page anchors and applies smooth scrolling.

**Why**
- The theme migration exposed both the explicit `toc` panels and a pathname mismatch that prevented smooth-scroll interception on the original sidebar links.

**Validation**
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Confirmed in both generated pages that the right sidebar is absent and all six left-navigation links resolve to existing anchors on the current page.
- `git -c core.whitespace=cr-at-eol diff --check`

**Risks / Follow-ups**
- No known follow-up; manually confirm the scroll animation in a browser at desktop width.

---

## 2026-09-30 16:58 BST — Header and Profile Spacing Restoration

**Summary**
- Restored the masthead site title to the original dark blue.
- Reduced the desktop biography wrapper's bottom margin so the degree, location, and email lines are evenly spaced again.

**Why**
- Updated theme selectors and author-profile markup changed two small visual details during the migration.

**Validation**
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Compared headless-browser screenshots of the untouched legacy build and migrated build at 1440×1000; the title color and profile-line spacing now match.
- `git -c core.whitespace=cr-at-eol diff --check`

**Risks / Follow-ups**
- None known.

---

## 2026-10-02 10:45 BST — Sidebar Focus Styling

**Summary**
- Removed the colored focus outline from links in the left sidebar navigation.
- Retained an underline as the keyboard-only focus indicator.

**Why**
- The upgraded theme's global focus outline appeared as a distracting frame around a clicked navigation entry during smooth scrolling.

**Validation**
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Confirmed the generated CSS removes the sidebar-link outline while preserving `:focus-visible` styling.
- `git -c core.whitespace=cr-at-eol diff --check`

**Risks / Follow-ups**
- None known.

---

## 2026-10-02 11:22 BST — Google Analytics 4 Restoration

**Summary**
- Enabled the theme's `google-gtag` provider with the GA4 destination already connected to the deployed site's legacy Universal Analytics tag.
- Replaced the indirect `analytics.js` migration bridge with a direct GA4 Google tag in production builds.

**Why**
- Preserve the working live analytics stream while removing reliance on the deprecated Universal Analytics integration.

**Validation**
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Confirmed all seven generated HTML pages contain the GA4 tag and none contain the legacy `analytics.js` or `UA-…` tag.
- `git -c core.whitespace=cr-at-eol diff --check`

**Risks / Follow-ups**
- After deployment, confirm a visit appears in the GA4 Realtime report; local network validation was intentionally avoided to prevent recording a test pageview.

---

## 2026-10-02 17:06 BST — Analytics Footer Notice

**Summary**
- Restored the “This website uses Google Analytics” footer notice and its link to Google's privacy-partners information.

**Why**
- Preserve the disclosure shown by the original site now that analytics is enabled again.

**Validation**
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Confirmed the notice and privacy link appear exactly once in all seven generated HTML pages.
- `git -c core.whitespace=cr-at-eol diff --check`

**Risks / Follow-ups**
- None known.

---

## 2026-10-07 12:49 BST — Demo Source Organization

**Summary**
- Moved the MG Constructor page into `_pages/demos/` while preserving its public `/demos/mg-constructor/` URL.
- Moved its sample grammars into `assets/demos/mg-constructor/grammars/` and updated all affected links.
- Normalized links to the demo to use its canonical trailing-slash URL.

**Why**
- Give each current and future demo a clear page location and an isolated asset namespace.

**Validation**
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Confirmed the generated demo and all five grammar files exist at their new paths and no source references use the former grammar path.

**Risks / Follow-ups**
- Any external links directly targeting the former `/assets/grammars/` files will need to use the new asset paths; the public MG Constructor page URL is unchanged.

---

## 2026-10-07 15:03 BST — Aletheria Browser Demo

**Summary**
- Published the standalone Aletheria web client at `/demos/aletheria/`, completing the existing “play in browser” link.
- Kept the client CSS, JavaScript, and external configuration under `assets/demos/aletheria-web/` and configured the client for `https://api.mermolaeva.com`.
- Added a page-level Content Security Policy restricted to same-origin resources and the Aletheria API for connections and API-hosted images.

**Why**
- Make the browser demo available from the website without adding a frontend build or dependencies.

**Validation**
- `bundle check`
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Confirmed the generated Demos link, Aletheria page, CSP, and all three referenced assets are present at their expected paths.

**Risks / Follow-ups**
- The API deployment must allow the exact website origin `https://mermolaeva.com`.
- Browsers do not enforce `frame-ancestors` when CSP is delivered through an HTML meta element; full framing protection requires the same policy in an HTTP response header at the hosting or CDN layer.
- End-to-end gameplay still requires the separately deployed API and should be smoke-tested after its CORS/origin configuration is active.

---

## 2026-10-07 15:35 BST — Aletheria Link New Tab

**Summary**
- Made the Aletheria “play in browser” link open in a new tab with `rel="noopener"` protection.

**Why**
- Keep the Demos page available while the standalone game is open.

**Validation**
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Confirmed the generated link includes `target="_blank"` and `rel="noopener"`.

**Risks / Follow-ups**
- None known.

---

## 2026-10-07 17:18 BST — Aletheria Analytics

**Summary**
- Added the site's configured GA4 tag to the standalone Aletheria page in production builds.
- Kept analytics initialization in a same-origin script and extended the page CSP only for Google's tag and collection endpoints.

**Why**
- The standalone page bypasses the theme layout and therefore did not inherit the site's analytics integration.

**Validation**
- `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_local.yml --destination _site_local`
- Confirm the generated Aletheria page contains the configured Google tag and same-origin initializer, while a development build omits both.
- Confirm the page CSP permits the Google tag and analytics collection endpoints without allowing arbitrary inline scripts.

**Risks / Follow-ups**
- After deployment, confirm an Aletheria visit appears in the GA4 Realtime report with content blocking disabled.

---
