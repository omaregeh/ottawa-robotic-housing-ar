# Ottawa Robotic Housing AR

An actual, programmatically animated 3D construction-site demonstration for Algonquin College MGT2204, supporting SDG 11. Parliament Hill belongs to your **static printed poster**. There is no 3D Parliament model or replacement video.

## Purpose and SDG 11

This educational prototype asks: **Could construction robotics help Ottawa build more affordable housing?** It connects to [UN SDG 11, target 11.1](https://sdgs.un.org/goals/goal11): access to adequate, safe and affordable housing. Canadian construction robotics could support productivity and skilled technical work, but construction savings alone do not guarantee affordable homes. The secondary campaign panel discusses winter limits, workforce changes and the role of housing policy without unsupported cost-saving claims.

## Run locally

Use Node.js 22 LTS and npm (Node.js 20.19+ was also tested). No API key, paid service or separate mobile app is required. Clone or download the repository, then:

```bash
cd ottawa-robotic-housing-ar
npm ci --ignore-scripts
npm run dev
```

Open **http://localhost:5173/**. Optimized models and a sample MindAR target are included, so no preparation step is required to try the project. `--ignore-scripts` avoids MindAR's unused server-side canvas installation; the browser bundles, Vite's platform binary and Sharp's prebuilt optional packages work without those scripts on the tested Linux system.

- Preview: `/` — no camera or tracking target required.
- Asset lab: `/?viewer=1` — orbit/zoom all 11 verified candidates, compare optimized/original versions, inspect metadata, load another local GLB, and export an identification decision. Original-quality viewing is offered only on the development server when the optional raw model copies are present. The Git repository includes both optimized qualities for every candidate; a fresh clone needs no raw originals.
- Scene editor: `/?editor=1` — **development only**, with the timeline held still. Open **Open scene editor**. Move/rotate/scale each asset, set width and ground offset, change model assignments, visibility, movement amplitude and animation settings. Angles are radians. Check placement warnings after edits.
- Standard quality: `/?quality=standard`. Mobile quality is the default.

Play, Pause, Restart, speed, phase-jump buttons, individual robot toggles, completed-house override, and Reset scene are available. The concrete printer loads only when enabled. Reduced-motion preferences start the timeline paused. Orbit/zoom is pointer controlled; playback, phase jumps and settings support keyboard controls.

## What is included

The 54-second loop has arrival, site preparation, frame placement, crane assistance, finished-home fade and restart phases. These are **illustrative operations**. All source models have one mesh and no skeleton or animation clips. Robots reposition as complete objects; no unverified articulated motion or mesh deformation is used. The crane's attached wall remains part of that same mesh. A whole timber frame is the building component that gently rises/settles during assembly.

Eight selected models load initially (the finished house is preloaded for a smooth fade). The optional printer and alternate frame/home are not loaded for the default scene. Turning a loaded object off hides it for instant reuse; it remains in GPU memory until reload. Changing quality reloads the page and releases the previous scene.

The selected lumber asset is a palletized materials collection containing lumber, not a dedicated single lumber-stack GLB. No distinct partially clad home was found; a verified timber-frame model is used for the unfinished state. The overhead vacuum lifting bar image is excluded. No source file was renamed, moved, modified or deleted.

## Scene configuration and placement

The portable default is [`src/config/scene.json`](src/config/scene.json). Each object has:

- `asset`: a verified ID from `public/models/manifest.json`;
- `position`: X across the site, Y additive lift, Z toward the preview foreground;
- `rotation`: XYZ Euler angles in radians, applied before bounding-box normalization;
- `width`: longest horizontal display span; `scale`: independent multiplier;
- `groundOffset`, `visible`, and `animation.enabled` / `animation.amplitude`.

Source units are arbitrary. The platform is normalized to 3 display units. Each object is remeasured after rotation, centered in X/Z and aligned at its minimum Y. Downward raycasting against upward-facing platform triangles estimates the concrete surface. Contact samples are reused for tiny movements to reduce CPU work. This is an approximate miniature placement system, not physics or terrain navigation. Large edits can place a machine over a curb or pole: use the placement warnings and inspect it in 3D. Horizontal normalization does not treat model units as metres.

**Export JSON** downloads the complete configuration. Replace `src/config/scene.json` with that exported file to make the layout the project default. **Save in browser** persists only for that browser's editor; it does not silently change source files. Import validates numeric transforms and known model assignments. **Reset scene** removes the saved browser layout and reloads source defaults. You can edit AR `scale`, `position`, `rotation`, `targetUrl`, and `targetIndex` directly in the JSON; the editor controls the individual scene objects.

## AR before the final poster is ready

Open **View in augmented reality** and select **MindAR sample**. Open/print [`public/targets/development.png`](public/targets/development.png) on another surface, then select **Start camera** and grant permission. The paired `development.mind` file is MindAR's official sample. It is a test target, not Parliament Hill. A sample can be viewed on a second screen, though a matte print usually reduces glare.

The timeline pauses when tracking is lost or the tab is hidden, hides with the anchor, and resumes from its current time on recovery. Your Play/Pause choice is preserved. Exit AR stops camera tracks and reloads the preview. Missing target files and camera failures return to the usable preview with an explanation. Camera access occurs only after Start camera. MindAR runs in the browser; there is no app installation or server-side camera upload.

## Add the final Parliament Hill poster

1. Finish the **exact image you will print**. Keep Parliament Hill as static 2D artwork. Use a detailed, high-contrast, asymmetrical illustration with distinctive features across the image. Avoid huge flat regions, repeated patterns, strong glare and tiny features. Check image licensing. Do not use the QR code as the image target.
2. Use the [official MindAR compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile). Add the final image and export the `.mind` file. For a single image use `targetIndex: 0`; for multiple targets match the compiler's order.
3. Copy the exported result to `public/targets/poster.mind`. Optionally keep a print-reference image in `public/textures/`. This app does **not** render that image in AR: the physical poster supplies the background.
4. Choose **My final Parliament Hill poster** in AR setup. Alternatively, upload the compiled `.mind` file for a browser-only trial. An upload does not save it into the project. Recompile whenever you materially change or crop the target artwork.
5. Print with unchanged aspect ratio and test on a matte, flat surface in even light. First acquire most of the image in the camera view; then move slowly and inspect from different angles.
6. Adjust the AR mapping in `scene.json`: target width is one MindAR unit. `scale: 0.30` makes the 3-unit platform roughly 0.9 of the printed target width. Rotation `+π/2` around X maps scene Y-up to target +Z, out of the paper. Scene +Z points toward the bottom edge of an upright target. `position` is in target coordinates, so negative target Y shifts the site toward the poster foreground. Tune this with the real poster angle and phone; upright and tabletop posters have different visual staging.
7. Rebuild and redeploy, keeping image and compiled target versions paired.

The decorative patterns on the GLB poles are scene details. They have no implemented marker-tracking role. The final poster and `.mind` are intentionally not fabricated or claimed as complete.

## Mobile and HTTPS testing

`http://localhost:5173` is camera-compatible on the computer itself. **`http://192.168…:5173` on a phone is generally not a secure context**: the normal 3D preview can work, but camera permission will not. Use a real HTTPS static deployment, or a development HTTPS certificate trusted by the phone. Do not bypass browser certificate warnings. `localhost` on a phone refers to that phone, not this computer.

For a real-device acceptance check:

- Test current Android Chrome and iOS Safari on the HTTPS URL, camera permission allowed and denied.
- Try the sample, then the exact final print; observe acquisition, anchoring, loss, recovery and Exit AR.
- Confirm the physical Parliament artwork remains unobscured where intended; adjust target-space placement.
- Watch all 54 seconds, the frame/home transition and restart; confirm machines stay on the concrete.
- Test rotation, distance, dim light, glare, browser background/resume and repeated start/exit.
- Monitor frame rate, heat and memory on a lower-end phone; use mobile quality and leave the printer off initially.

No physical-phone test is claimed. Read [`reports/testing.md`](reports/testing.md) for the checks actually performed and their limits.

## Build and deploy

```bash
npm test
npm run validate
npm run build
npm run preview
```

Serve the contents of `dist/` using an HTTPS static host such as GitHub Pages, Netlify, Cloudflare Pages or another static web server. Build command: `npm ci --ignore-scripts && npm run build`; output directory: `dist`. Normal builds use a portable relative base. GitHub Pages builds use the explicit repository base described below. The build omits original GLBs and the development editor. Optimized alternatives remain available to the public Asset lab. Keep `.glb`, `.mind`, `.png`, `.webp` and JS chunks served normally; avoid an SPA fallback that returns HTML for missing binary files.

`public/_headers` provides camera/self and microphone-denied policy suggestions for hosts that support that file. HTTPS configuration belongs to the host; no TLS certificate or public deployment is created by this local task. Set compression and long cache lifetimes for versioned JS assets; invalidate models/targets when updating them. The dynamically imported MindAR bundle is larger than the preview bundle and loads only when starting AR.

Once deployed, enter the **public HTTPS URL** into the AR setup's QR generator. Download the QR image and scan-test it before printing. Keep the QR separate from the tracked illustration, or finalize the complete composite before compiling the target. QR codes open the website; they do not supply 3D tracking.

## GitHub repository and Pages

The intended repository name is **`ottawa-robotic-housing-ar`**. The local initial commit includes source, the lockfile, 22 optimized GLBs, the runtime checksum manifest, inspection thumbnails, and the paired MindAR sample target/image. Raw originals, dependencies, build output, logs, caches, generated QA screenshots and private working files remain outside Git.

The largest tracked GLB is 7.19 MiB. Regular Git is used; no Git LFS installation is required. See the [storage, privacy and licensing review](reports/github-readiness.md). The owner has confirmed the ChatGPT-to-Trellis2 input workflow. The documented review found no known restriction preventing publication, with the historical Hugging Face Space and limits of visual verification disclosed. No blanket reuse license is assigned to the owner's code or assets.

To build the Pages version locally:

```bash
npm run build:pages
npm run preview:pages
```

Open `http://localhost:4173/ottawa-robotic-housing-ar/`. The Vite base is `/ottawa-robotic-housing-ar/`, including model, target, thumbnail and dynamic module URLs. For a custom domain or user-root site, set `VITE_BASE_PATH=/` for the build instead. The default non-Pages `npm run build` still works on other static hosts.

**Publication and deployment have been authorized by the owner after the documented review.** The `private: true` package field prevents accidental npm publication; it does not configure GitHub repository visibility. To run a later deployment after the repository is pushed:

1. Enable GitHub Pages using **Settings → Pages → Source: GitHub Actions**.
2. Run **Deploy GitHub Pages (manual)** from the Actions tab when ready to publish. It is intentionally not triggered by push.
3. Open the returned HTTPS URL on a phone and test the sample/real poster before creating a printed QR code. Check the account's Pages visibility/plan settings; do not assume a private repository produces a private website.

The separate validation workflow runs on push/PR and does not deploy. The application is static: no application secrets are needed. GitHub-provided workflow tokens are referenced only through Actions' built-in permission system; no token is stored in source. GitHub Pages does not implement the optional `_headers` file used by some other hosts.

## Reproduce the asset pipeline

The tracked optimized assets reproduce the application directly, so **do not rerun model generation just to build a clone**. Raw inputs are preserved locally but ignored by Git. To regenerate geometry, obtain the exact reviewed original GLBs, keep their filenames, and optionally set `ASSET_SOURCE_DIR` to that folder (default: your Downloads folder). Then:

```bash
npm run originals:copy
blender --background --threads 4 --python tools/render_assets.py
# Review reports/thumbnails before changing selections.
blender --background --threads 4 --python tools/decimate_assets.py
npm run optimize
python3 tools/generate-reports.py
npm run validate
```

The optional `npm run inventory` audit scans November 18–21, 2026 in America/Toronto and includes filesystem birth time when available. It parses GLB geometry, transforms, textures, materials, animations and hashes. `tools/inventory.py` requires Python 3, NumPy and Pillow. Blender was present on the tested system. The filename-to-ID mapping is explicit in `src/config/asset-selections.json`; the optimizer refuses to continue if the candidate roster changes. Review new thumbnails before updating that selection file. The optimizer never automatically includes unrelated Downloads assets. Its copy operation refuses to overwrite existing original project copies.

Blender's modifier/export writes only `.local/prepared/` working copies. It performs UV-aware collapse decimation on the machines and timber frames. The platform and finished houses retain seam-preserving Meshopt simplification for visual quality; standard quality uses that method for every asset. The next step compresses textures and geometry using glTF Transform and Meshopt. If prepared mobile copies are absent, the optimizer can fall back to Meshopt-only simplification, which retains far more triangles on these seam-heavy models; the report records the method. Optimized files are regenerable and can be overwritten. Downloads and `public/models/original/` are preserved. See [`reports/performance.md`](reports/performance.md) for actual reductions and tradeoffs.

## Troubleshooting

- **Blank canvas:** check WebGL support/hardware acceleration and the browser console. Use a current Chrome/Safari/Firefox for preview. Avoid opening `index.html` as `file://`; use Vite or a static server.
- **Missing models:** run from the project root, check `public/models/manifest.json`, and inspect the status/console. Run the pipeline only after verifying the source mapping.
- **Camera unavailable:** ensure HTTPS on the phone, close another app using the camera, and reset the browser's site camera permission. Open the page directly instead of inside a QR app's embedded browser.
- **No detection:** the compiled target must match the printed image, target index and image aspect ratio. Use even light, focus, less glare and a larger target in view. Confirm detection with the official sample first.
- **Floating/sinking:** correct source rotation, inspect bounds in Asset lab, then adjust per-object ground offset in the editor. An outlier or integrated slab may make visual contact differ from the bounding-box bottom.
- **Slow/hot device:** use mobile quality, omit the printer, close other 3D tabs, reduce the pixel-ratio cap in `src/main.js` / `src/components/ar.js`, and shorten the active session. The scene has no shadows or postprocessing passes.
- **Dependencies/security:** MindAR 1.2.5 still brings some older Node installation helpers. Installation scripts stay disabled. Vite 6.4.6 and Sharp 0.35.5 are pinned, and a scoped npm override updates the helper’s tar dependency to 7.5.23. A full npm audit reported zero advisories during the publication review. Run `npm audit` again when updating dependencies; avoid `npm audit fix --force` without rebuilding and checking AR compatibility.

`npm run validate` checks all tracked runtime assets and their checksums even in a clean clone with no originals. If optional raw inputs are present, it verifies them too. Use `npm run validate:originals` to require and check both Downloads/source inputs and local original copies. `npm run check:repo` scans staged contents before a commit; `npm run check:repo -- --worktree` checks tracked working files in CI. These practical scans do not establish asset ownership or detect every possible secret format.

## Reports and provenance

- [Asset inventory](reports/asset-inventory.md), [CSV](reports/asset-inventory.csv), [complete JSON](reports/inventory.json)
- [GLB contact sheet](reports/model-contact-sheet.jpg)
- [Performance and optimization](reports/performance.md), [machine-readable measurements](reports/optimization.json)
- [Testing and remaining limitations](reports/testing.md)
- [Third-party source and target notices](THIRD_PARTY_NOTICES.md)

Educational sources are linked in the app's secondary **The idea** panel. Potential productivity gains are presented without unsupported saving percentages. Lower construction costs alone do not guarantee affordable rents or sale prices.

For isolated automated browser checks (with Vite running), use `npm run test:browser`, `node tools/editor-smoke.mjs`, and `node tools/error-smoke.mjs`. They use a temporary headless Chrome profile, not your normal browser. Set `CHROME_BIN` if needed. For the synthetic tracking check, run `bash tools/prepare-test-camera.sh` (requires FFmpeg), then `npm run test:ar`. The generated test camera fixture lives only in `.local/`, is not deployed, and is not a replacement for the actual 3D experience.

## Phone testing without deploying a website

A public GitHub repository serves source files; its repository URL is not an AR website. With Pages disabled, run the project locally on your computer as described above.

On an Android phone, one local-only option is Chrome's [USB port forwarding](https://developer.chrome.com/docs/devtools/remote-debugging/local-server). Connect the phone to your trusted development computer, complete Android/Chrome's remote-debugging setup yourself, and forward phone port `5173` to computer `localhost:5173`. Open `http://localhost:5173/` in the phone's Chrome browser. This reaches the Vite server through the USB connection and uses the phone's localhost secure-context exception; it does not deploy the site. Disable debugging when finished. Alternatively, with Android Platform Tools configured, `adb reverse tcp:5173 tcp:5173` provides that local port mapping.

For iPhone Safari, or testing across the LAN without USB forwarding, use a local HTTPS setup whose certificate the phone trusts. Plain `http://<computer-LAN-IP>:5173` can show the 3D preview but generally cannot access the camera. Do not bypass certificate warnings. No certificate/trust-store configuration or external tunnel has been installed by this project.

Once the phone can securely reach the local site: open the paired sample target on a second screen or print it; choose **View in augmented reality → MindAR sample → Start camera**, allow camera permission, and aim at that image. Try detection, movement, tracking loss/recovery and Exit AR. Repeat later with the exact compiled final poster. The physical poster provides the 2D Parliament Hill background. Real-device tracking quality remains unverified until you perform that test.
