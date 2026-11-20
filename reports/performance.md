# Performance and optimization

## Measured assets

Default eight loaded models: **207.72 MiB → 7.51 MiB**, a 96.4% reduction in model transfer size. Geometry: **5,047,568 → 300,957 triangles** loaded. The finished house is preloaded but invisible initially; normal rendering draws one house state, with both states present during the short fade. These figures exclude JS, the tracking target and thumbnail images.

| Model | Original MiB / triangles | Mobile MiB / triangles | Standard MiB / triangles |
|---|---:|---:|---:|
| arm | 12.65 / 292,585 | 0.48 / 15,903 | 1.98 / 85,569 |
| rover | 11.16 / 281,221 | 0.42 / 14,598 | 1.31 / 49,999 |
| frame | 11.24 / 285,177 | 0.29 / 11,735 | 1.08 / 49,994 |
| finishedAlt | 10.77 / 277,958 | 0.96 / 37,900 | 1.19 / 49,998 |
| finished | 14.06 / 298,652 | 2.28 / 91,771 | 2.43 / 91,829 |
| frameAlt | 11.01 / 288,120 | 0.24 / 9,130 | 1.03 / 49,996 |
| lumber | 36.88 / 981,313 | 0.49 / 16,771 | 2.43 / 111,160 |
| excavator | 39.60 / 984,249 | 0.44 / 13,166 | 3.05 / 136,640 |
| crane | 42.73 / 988,808 | 0.48 / 12,383 | 4.60 / 214,086 |
| printer | 45.64 / 979,777 | 0.44 / 12,055 | 7.19 / 366,263 |
| ground | 39.40 / 935,563 | 2.63 / 124,630 | 4.10 / 124,730 |

## Preparation and visual limits

Original GLBs and Downloads remain unchanged. Mobile machines/frames use Blender UV-aware collapse decimation on temporary working copies, texture resizing/WebP compression, then glTF Transform simplification/quantization and Meshopt compression. The platform uses seam-preserving Meshopt-only simplification: an aggressive collapse version produced visible holes and was discarded. Both finished houses also retain seam-preserving processing to avoid roof artifacts at the scene’s focal point. Standard quality uses seam-preserving processing for every asset.
Standard quality defaults total 20.98 MiB and 864,007 loaded triangles. Use it for desktop inspection or capable phones after testing. Simplification targets are upper ambitions, not guaranteed outputs: UV seams and the error budget may retain extra triangles.

Mobile textures are at most 512² for most models and 1024² for platform/houses; standard uses 1024² and 2048² for the platform. Original textures range from 2048² to 4096². Small model details, tread geometry, surface texture and roof features lose fidelity at mobile quality. Compare the original and optimized contact sheets / Asset lab before presenting at unusually large scale. Thin fences and poles remain recognizable in the restored platform. No guarantee of CAD-level accuracy or dimension fidelity is made.

## Runtime choices

- Only eight selected assets load for the default scene. Alternate versions load in Asset lab; the concrete printer loads on first enable. No unrelated Downloads model is served.
- No realtime shadows, postprocessing, physics engine or articulated deformation. One short movement phase runs at a time.
- Preview pixel ratio is capped at 1.3 (mobile) or 1.75 (standard); AR is capped at 1.5. A lower cap is available by editing the renderer setup.
- Ground contacts are cached for small movements. Scene normalization is calculated at load/edit time.
- Turning a robot off hides its draw calls but retains its loaded GPU resources for quick reuse. Reset/quality changes reload the page; Asset lab disposes replaced model geometry/materials/textures.
- The timeline freezes in hidden tabs and when the tracked image is lost. Rendering itself still runs so the camera/tracker can recover.
- MindAR/TensorFlow is loaded only at AR start. Its bundled JS is approximately 2.1 MB uncompressed (roughly 0.36 MB gzip); this is the expected production chunk-size warning.
- Production dist excludes original GLBs and the development editor. All optimized versions remain downloadable because the public Asset lab offers them.

## Device recommendations

Begin with mobile quality and printer off. Test the real poster on lower-end Android Chrome and iOS Safari. If heat, frame time or memory are poor, lower the pixel cap further, keep optional equipment off, reduce texture limits and measure again. Browser/GPU memory is larger than the compressed transfer size because textures and geometry expand on upload. A WebP file being small does not imply a small GPU allocation.

Desktop software-rendered smoke tests verify behavior and rendering, not a mobile frame-rate guarantee. No physical-phone performance, battery or thermal measurement was performed.
