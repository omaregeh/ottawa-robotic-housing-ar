# GitHub preparation review

Repository name: `ottawa-robotic-housing-ar`. The owner has explicitly authorized public repository creation, push, GitHub Pages and deployment after the documented final checks.

## Asset storage

All 33 project GLBs were checked: 11 preserved source copies (275.14 MiB total; largest 45.64 MiB) and 22 optimized runtime files (39.53 MiB total; largest 7.19 MiB). No GLB exceeds GitHub's 50 MiB warning threshold or 100 MiB regular-Git file limit. The 22 optimized files, their checksum manifest, and paired MindAR development target/image are included for a working fresh clone. Raw GLBs remain unchanged in Downloads and `public/models/original/`; the latter is ignored by Git. No original was deleted.

Regular Git is appropriate for this initial asset set. Git LFS is not configured: runtime files are small enough for regular Git, and [GitHub states LFS cannot be used with Pages sites](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage). [GitHub's file limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github) were checked. Avoid committing repeated raw model versions; review storage again if binary sizes/history grow. The raw regeneration pipeline is optional and needs separately retained originals; it is not a prerequisite for building or running the tracked project.

## Licensing and provenance

The owner confirms ChatGPT-generated reference images converted using Trellis2, with no supplied third-party photographs/artwork known to have been used. The official TRELLIS.2 code/checkpoint are MIT licensed, and the inspected private Colab notebook corroborates that checkpoint. All 57 images were visually reviewed; the sole known different-origin image is the official MindAR sample, whose MIT notice is included. The exact older Hugging Face Space is unrecovered and remains a documented provenance limit. See `final-publication-audit.md` and `THIRD_PARTY_NOTICES.md` for sources and qualifications. No umbrella license is assigned to the owner's work. The owner has now authorized public publication, Pages and deployment after these checks.

## Privacy and credentials

No application credentials or secrets are required. The staged-file scanner checks known token/key patterns, suspicious credential assignments, email addresses, local home paths, concrete private-network addresses, generated-thumbnail metadata and excluded file types. GLB JSON metadata is included in the scan; source/thumbnail images were reviewed for unrelated personal content. Findings are reported by filename/category, never by secret value. A clean scan is a practical check, not proof that every possible secret format is detectable.

Machine-specific inventory paths were removed from the tracked inventory after preserving an exact private backup in `.local/`. Tools use the current home directory or `ASSET_SOURCE_DIR` instead of a named home directory. Generated PNG thumbnails had render text/EXIF metadata removed without changing their pixels; exact pre-sanitization copies are preserved privately in `.local/`. Logs, caches, raw originals, generated screenshots and synthetic camera fixtures are ignored. The local Git author uses the authenticated account's public GitHub noreply address, rather than a personal email. Authentication tokens remain in their existing external credential stores and are not copied into the repository.

## GitHub Pages

`npm run build:pages` sets the Vite base to `/ottawa-robotic-housing-ar/`, as described in the [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages). Normal `npm run build` remains portable with a relative base; `VITE_BASE_PATH` can override it. Deployment uses only `dist/`, excludes originals/editor, and includes `.nojekyll`.

CI validates and builds on push/PR. The Pages workflow is **manual only** (`workflow_dispatch`), with deployment permissions scoped to the deployment job. No push automatically publishes the website. Repository Pages settings and a manual workflow run are later owner-approved steps. GitHub Pages does not honor the host-specific `_headers` file; the application still requires a secure context and a user camera permission gesture.

## Local validation for GitHub preparation

- Timeline unit tests and all 22 optimized runtime checksum/geometry validations passed.
- All 11 Downloads originals and 11 preserved raw copies passed their original SHA-256 checks.
- The staged candidate set is about 44.05 MiB, with no credential/private-information findings after review. Public npm maintainer contact information is registry metadata, not the owner’s personal contact data.
- A file-only export of the staged repository passed a clean offline dependency installation, all timeline tests, validation of all 22 runtime GLBs with zero original inputs present, and the Pages build. Pages-mode browser checks and synthetic tracking checks passed at `/ottawa-robotic-housing-ar/`, including tracking loss/recovery and camera cleanup. A physical phone is still untested.
- Authentication was checked read-only: both the GitHub connector and local CLI identified the same account. No credential values were copied or logged.
