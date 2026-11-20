# Validation and remaining limitations

Validated locally on Kubuntu, November 20, 2026. Original downloads were preserved. This is a browser-based 3D implementation using Vite, Three.js 0.160.1 and MindAR 1.2.5.

## Checks performed

| Check | Result and scope |
|---|---|
| Asset identification | 11 GLBs within the Ottawa-local date window and adjacent-day scan. Blender renders of each original reviewed, alongside reference PNGs. |
| Source preservation | SHA-256 checks for all 11 original Downloads files and their project copies match the inventory. |
| Optimized files | All 22 quality outputs decoded with glTF Transform + Meshopt, with valid nonempty meshes and finite position attributes. |
| Geometry/visual review | Original and mobile contact sheets, assembled oblique/overhead preview. Aggressively decimated platform rejected due to holes; restored seam-preserving platform reviewed. |
| Timeline tests | Three tests: six phases cover 54 seconds; completion/reset continuity; pause, tracking freeze and speed. |
| Development and production browser smoke | Isolated headless Chrome, software WebGL. Model loading, play/pause, completed-house fade, phase controls, individual robot toggle, finished-house override, missing-target feedback, mobile viewport and asset viewer. |
| Placement | Default loaded objects have valid platform contact samples and no unexpected bounding-box overlaps. Frame/finished-house bounds intentionally coincide for the fade. |
| Development editor | Transform edit, browser persistence across reload, exported JSON content and QR image generation. |
| Error paths | Mocked denied camera, preview restoration, resize after failure, malformed compiled target rejected before starting camera. |
| Synthetic MindAR tracking | Real MindAR runtime with a synthetic webcam stream containing the official test image and blank intervals. Detection, anchored 3D rendering, target loss/hide, timeline freeze, target recovery/resume and Exit AR passed. No real camera feed was used. |
| Production build | `npm run build` passes. Expected large-chunk warning for the dynamically imported MindAR/TensorFlow runtime. Originals and development editor omitted from output. |

Machine-readable evidence: `validation.json`, `browser-smoke.json`, `editor-smoke.json`, `error-smoke.json`, `ar-smoke.json` and `optimization.json`. Screenshots include `preview-desktop.png`, `preview-mobile.png`, `preview-completion.png`, `asset-viewer.png`, `scene-editor.png` and `ar-synthetic-found.png`.

## How to reproduce

Start `npm run dev`, then in another terminal:

```bash
npm test
npm run validate
npm run test:browser
node tools/editor-smoke.mjs
node tools/error-smoke.mjs
bash tools/prepare-test-camera.sh
npm run test:ar
npm run build
```

Headless checks launch a temporary Chrome profile. They do not attach to the user's normal browser. Chrome is expected at `/usr/bin/google-chrome`; set `CHROME_BIN` for a different installed path. The synthetic test uses FFmpeg to produce a temporary Y4M input in `.local/`. It is test data only, not a product video. Runtime models are always real GLB geometry animated by JavaScript. Software WebGL timing can differ greatly from a phone GPU; synthetic tracking is not equivalent to testing a moving handheld camera or real printed surface.

## Remaining limitations and required acceptance work

- **Final target not supplied:** the Parliament Hill poster and matching compiled `poster.mind` still need to be finalized, compiled and tested. The official sample and browser `.mind` upload are usable interim paths. The real printed artwork remains the static 2D background.
- **No physical-device test:** Android/iOS camera permissions, optical acquisition, motion, realistic perspective, lighting, phone orientation, thermals and sustained frame rate remain to be checked on actual phones. No deployed HTTPS URL or QR to a real deployment is claimed.
- **Approximate animation:** one mesh per source asset, no rig. Whole robot positioning/yaw, whole-frame rise/settle and material fades are used. There is no independently moving bucket, arm joint, crane cable or crane wall. This is an illustrative sequence, not an autonomous planning or engineering simulation.
- **Asset gaps:** no dedicated partially clad house or standalone lumber-stack GLB was identified. The selected verified frame and palletized-material collection are documented fallbacks. The rejected overhead vacuum-bar asset is excluded.
- **Mobile tradeoff:** the default loads roughly 7.51 MiB of GLBs and 300,957 triangles. Geometry/texture detail is reduced. Standard quality is substantially heavier. The platform retains additional triangles to preserve a continuous working surface and integrated fencing/poles.
- **Contact approximation:** minimum-Y normalization and local downward raycasts are not wheel contact physics. Large manual changes may place a model over site features. Off-platform objects are hidden and flagged until corrected; inspect edited layouts from multiple angles.
- **Resource behavior:** hidden robots stay loaded for quick reuse. AR Exit reloads the page after stopping camera tracks, releasing the AR session. Browser background pauses animation progression; camera permission/session behavior while backgrounded still needs device testing.
- **Preview controls:** scene orbit/zoom is pointer/touch driven. Playback, phase jumps, settings and editor controls are keyboard accessible. Reduced-motion users start paused. No nonvisual equivalent conveys the full 3D geometry; the phase text explains the sequence.

Use the README's phone acceptance checklist before presenting the campaign as a tested WebAR experience.

## GitHub preparation

A clean file-only export was installed and built without raw GLBs. Runtime validation now works from the tracked optimized assets and verifies their checksums; `validate:originals` additionally requires the private raw inputs. The Pages build uses `/ottawa-robotic-housing-ar/`. See [GitHub readiness](github-readiness.md) for storage, credential scanning, licensing concerns and publication controls. No remote repository, push or public website was created during preparation.
