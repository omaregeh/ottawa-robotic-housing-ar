# Poster recovery after restart

Recovered on November 20, 2026, from a clean `main` checkout at `cdeded4`, matching `origin/main`. `git status`, `git diff`, recent commits and reflog showed no unfinished tracked source edits. Existing application, models, development targets, reports and previous Pages deployment were retained. Ignored local QA files and the poster Python environment also survived. No unrelated files were deleted.

## Recovered progress

The Downloads file **Building Ottawa’s Future AR Poster.png** was present (1103 × 1426 pixels). Its bottom-right QR already decoded to `https://omaregeh.github.io/ottawa-robotic-housing-ar/`; a fake QR replacement was therefore already complete in the recovered artwork. No second replacement was necessary. The image's earlier editing history cannot be established from Git because the source was outside the repository.

No final print PDF or compiled Ottawa target was present in the repository. The existing scene configuration already referenced `targets/poster.mind` at index 0, but that file had not been supplied and the interface defaulted to the sample.

## Completed work

- Copied the recovered image to `public/targets/poster.png` without changing any bytes. Source and copy SHA-256: `32e2f3f67e8b26f955f72507d80715c4c28cb2509c03c912a5b2b400cf5d7ca6`. The original Downloads file remains untouched.
- Created `public/print/ottawa-housing-poster-letter.pdf`: one portrait US Letter page, at least 0.25 inch margins, unchanged aspect ratio, no cropping. The original raster is approximately 138 ppi at this print size; no extra detail is implied by enlargement.
- Rendered and visually inspected the PDF. ZXing decoded the poster PNG and the rendered PDF in four orientations each, and at a reduced 700-pixel size. All ten checks returned the production URL.
- Compiled the entire exact PNG with the installed MindAR 1.2.5 browser compiler, locally in isolated Chrome. `poster.mind` is format v2, target index 0, 992,030 bytes, 12 matching keyframes, and 45/29 tracking features at the two tracking scales. Asset hashes and dimensions are recorded in `public/targets/poster.json`.
- Made the Ottawa poster the default AR choice, added matching image/PDF links and instructions, retained sample/upload choices, and prefilled the optional QR generator with the deployment URL.
- Retained the established scene placement and animations. Added poster integrity validation to `npm run validate`, so CI rejects mismatched image, PDF or target files.
- Updated browser checks to simulate a missing target explicitly now that the real target exists. Added a separate poster camera fixture without overwriting the recovered sample fixture.

## Verification

Passed: timeline tests; validation of all 22 optimized GLBs; all 11 original Downloads and preserved model-copy checksums; paired poster asset checksums and dimensions; development browser tests (playback, transitions, toggles, missing-target fallback, mobile width, asset viewer); denied-camera and malformed-target recovery; editor persistence/export and QR generation; production Pages build; production browser and synthetic poster tracking at the repository base path; staged publication scan (101 files, no findings).

Real MindAR runtime with a synthetic camera showing the actual Ottawa PNG passed acquisition, visible anchored 3D, target loss/hide, timeline freeze, reacquisition and Exit AR camera cleanup. `reports/poster-ar-smoke.json` and ignored screenshots retain local evidence. The test feeds images through the real tracking runtime; it is not a physical camera test.

## Remaining acceptance work

Try the printed PDF on real Android Chrome and iOS Safari: scan the physical QR, grant camera permission, acquire the whole poster, move through realistic angles and lighting, inspect foreground placement, watch the complete construction cycle, and verify loss/recovery and repeated start/exit. Physical phone optics, print quality, glare, temperature and frame rate cannot be certified by desktop synthetic tests.

## Verified poster deployment

- Application commit: `ff406c42f6112b88c2cfd2eac6983c0e67f4a572`.
- Successful Pages workflow: https://github.com/omaregeh/ottawa-robotic-housing-ar/actions/runs/44842188284
- Successful clean-install CI: https://github.com/omaregeh/ottawa-robotic-housing-ar/actions/runs/44842171288
- Live website: https://omaregeh.github.io/ottawa-robotic-housing-ar/
- Printable poster: https://omaregeh.github.io/ottawa-robotic-housing-ar/print/ottawa-housing-poster-letter.pdf
- The four live poster assets (PNG, PDF, metadata and `.mind`) and five application entry resources matched the local Pages build byte-for-byte. The HTML references the current application bundles.
- The existing 41-resource HTTP audit passed, including all 24 existing model/development-target checksums, private inventory path exclusion and raw-original 404. An initial exclusion probe received a transient 503; the direct retry and complete audit returned the expected result.
- Isolated Chrome against the deployed HTTPS URL passed preview/playback, completed-house transition, toggles, missing-target recovery, mobile layout and asset viewer.
- The deployed MindAR runtime passed synthetic-camera Ottawa poster acquisition, visible anchored 3D, loss/hide, timeline freeze, reacquisition and Exit AR cleanup, with no page or console errors.

Only documentation changed after this deployment. The existing manual Pages workflow remains manual. Physical print and phone acceptance are still required as described above.
