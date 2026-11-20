# Asset inventory — Ottawa robotic housing AR

Audit timezone: **America/Toronto**. Primary window: November 19–20, 2026. Adjacent dates November 18 and 21 were also scanned recursively in Downloads, using creation OR modification date. All 11 GLBs present in Downloads matched; there were no additional creation-only candidates. All 11 candidate GLBs were modified on November 20 (UTC−05:00). No adjacent-day GLBs matched. Generic filename time strings were not treated as authoritative timestamps. Creation times below are filesystem birth times from `stat %W`; these are download/file creation times, not proof of generation time.

Original files were read only. Project copies preserve filenames and SHA-256 content. Unrelated GLBs outside the date window were not imported. No rejected overhead vacuum lifting bar GLB was found among these candidates; its reference PNG is explicitly excluded from the runtime.

## Candidate summary

| Thumbnail / filename | Birth time (Ottawa) | Modified (Ottawa) | MiB | Meshes / triangles | Animations | Visual identification |
|---|---|---|---:|---:|---|---|
| [Thumbnail](thumbnails/00.png) · `sample_2026-11-20T071123.041.glb` | 2026-11-20T01:11:29-05:00 | 2026-11-20T01:11:31.369330-05:00 | 12.65 | 1 / 292,585 | None | Tracked construction arm |
| [Thumbnail](thumbnails/01.png) · `sample_2026-11-20T071708.664.glb` | 2026-11-20T01:17:15-05:00 | 2026-11-20T01:17:17.201868-05:00 | 11.16 | 1 / 281,221 | None | Material delivery rover |
| [Thumbnail](thumbnails/02.png) · `sample_2026-11-20T073451.446.glb` | 2026-11-20T01:34:57-05:00 | 2026-11-20T01:34:58.064566-05:00 | 11.24 | 1 / 285,177 | None | Wooden house frame |
| [Thumbnail](thumbnails/03.png) · `sample_2026-11-20T073844.642.glb` | 2026-11-20T01:38:56-05:00 | 2026-11-20T01:38:59.617777-05:00 | 10.77 | 1 / 277,958 | None | Modular house · charcoal roof |
| [Thumbnail](thumbnails/04.png) · `sample_2026-11-20T074504.681.glb` | 2026-11-20T01:45:15-05:00 | 2026-11-20T01:45:18.728857-05:00 | 14.06 | 1 / 298,652 | None | Modular house · solar roof |
| [Thumbnail](thumbnails/05.png) · `sample_2026-11-20T075042.939.glb` | 2026-11-20T01:50:48-05:00 | 2026-11-20T01:50:51.096528-05:00 | 11.01 | 1 / 288,120 | None | Timber frame · slab and lumber |
| [Thumbnail](thumbnails/06.png) · `Palletized Building Materials Collection (3).glb` | 2026-11-20T03:48:00-05:00 | 2026-11-20T03:48:00.307810-05:00 | 36.88 | 1 / 981,313 | None | Palletized materials and lumber |
| [Thumbnail](thumbnails/07.png) · `Autonomous Yellow Excavator Render.glb` | 2026-11-20T03:58:47-05:00 | 2026-11-20T03:58:47.840439-05:00 | 39.60 | 1 / 984,249 | None | Cabless autonomous excavator |
| [Thumbnail](thumbnails/08.png) · `Robotic Crawler Crane Lifting Wall Panel.glb` | 2026-11-20T04:04:47-05:00 | 2026-11-20T04:04:47.537973-05:00 | 42.73 | 1 / 988,808 | None | Tracked crane with integrated wall |
| [Thumbnail](thumbnails/09.png) · `Industrial Concrete 3D Printer Building Foundations-2.glb` | 2026-11-20T04:15:49-05:00 | 2026-11-20T04:15:50.137488-05:00 | 45.64 | 1 / 979,777 | None | Concrete 3D printer |
| [Thumbnail](thumbnails/10.png) · `Isometric Construction Site Diorama.glb` | 2026-11-20T04:36:20-05:00 | 2026-11-20T04:36:20.285183-05:00 | 39.40 | 1 / 935,563 | None | Construction-site platform |

## Selection and gaps

- **Main sequence:** frame (sample 073451), solar-roof finished home (sample 074504), arm, rover, palletized materials, excavator, tracked crane and ground. Each was identified from a render of the GLB itself, with the related PNGs as supporting references.
- **Alternatives:** sample 073844 is the simpler finished home; sample 075042 is a second timber frame with slab and lumber. Both remain available in Asset lab and can be assigned in the development editor.
- **Lumber:** the identified GLB is a collection of materials containing lumber, boards and other supplies. A standalone strapped-lumber reference PNG exists, but no matching standalone GLB was found.
- **Partially built house:** two frames were identified; a distinct partially clad house GLB was not found. The timber frame is the unfinished-state fallback.
- **Printer:** identified and optimized, but off by default to avoid clutter and extra transfer. Turning it on loads it on demand.
- **Rejected:** `Robotic Lift Handling Prefab Wall Panel-3.png` shows the overhead vacuum bar. It is not a runtime texture or model and was not used as a substitute for the crawler crane.
- **Ground:** final GLB by modification time, 04:36 Ottawa on November 20. Its integrated fences and two decorative marker poles are preserved. These symbols are not tracking targets.

## Geometry and preparation

All candidates have one mesh node, one primitive, one material, no skin/skeleton and no animation clips. Independent movement of booms, buckets, crane wall or arm joints is **not validated**. No joint separation was attempted; whole-object movement preserves the imported shapes. All objects are close to centered around their geometry, but their bottoms lie below Y=0. Their source units are arbitrary.

Dimensions below use the original glTF scene transforms and its Y-up coordinate system. The application measures again after rotation, centers the horizontal footprint, places the bottom at zero and scales by the longest horizontal dimension. The platform is 3 display units across; other positions are relative display units.

| Filename | Width X | Height Y | Depth Z | Minimum Y | Center X/Y/Z | Centered? | Ground contact at zero? | Texture dimensions |
|---|---:|---:|---:|---:|---|---|---|---|
| `sample_2026-11-20T071123.041.glb` | 0.95786 | 1.00139 | 0.50319 | -0.50079 | 0.00824, -0.00009, -0.00000 | True | False | 2048×2048, 2048×2048 |
| `sample_2026-11-20T071708.664.glb` | 0.52430 | 0.48663 | 1.00186 | -0.24359 | 0.00008, -0.00028, 0.00005 | True | False | 2048×2048, 2048×2048 |
| `sample_2026-11-20T073451.446.glb` | 1.00173 | 0.67276 | 0.84931 | -0.33579 | -0.00001, 0.00059, 0.00001 | True | False | 2048×2048, 2048×2048 |
| `sample_2026-11-20T073844.642.glb` | 1.00092 | 0.49468 | 0.65604 | -0.24646 | 0.00051, 0.00088, -0.00095 | True | False | 2048×2048, 2048×2048 |
| `sample_2026-11-20T074504.681.glb` | 1.00192 | 0.57035 | 0.83556 | -0.28533 | 0.00001, -0.00015, -0.00049 | True | False | 2048×2048, 2048×2048 |
| `sample_2026-11-20T075042.939.glb` | 0.95133 | 0.74642 | 1.00176 | -0.37282 | 0.01739, 0.00039, 0.00005 | True | False | 2048×2048, 2048×2048 |
| `Palletized Building Materials Collection (3).glb` | 1.00170 | 0.45253 | 0.65406 | -0.22664 | -0.00002, -0.00038, -0.00019 | True | False | 4096×4096, 4096×4096 |
| `Autonomous Yellow Excavator Render.glb` | 1.00168 | 0.57584 | 0.45984 | -0.28807 | -0.00007, -0.00014, 0.00138 | True | False | 4096×4096, 4096×4096 |
| `Robotic Crawler Crane Lifting Wall Panel.glb` | 0.45231 | 0.61551 | 1.00183 | -0.30872 | -0.00078, -0.00097, 0.00011 | True | False | 4096×4096, 4096×4096 |
| `Industrial Concrete 3D Printer Building Foundations-2.glb` | 1.00092 | 0.57879 | 0.74995 | -0.28962 | 0.00001, -0.00022, 0.00091 | True | False | 4096×4096, 4096×4096 |
| `Isometric Construction Site Diorama.glb` | 0.99920 | 0.31728 | 0.83013 | -0.15781 | 0.00009, 0.00083, -0.00138 | True | False | 4096×4096, 4096×4096 |

All original textures are embedded WebP, with a base-color map and a metallic/roughness map. Originals are opaque, single-sided PBR materials. High polygon counts and 4096² textures are the main mobile risks. The floor is located with a downward ray and upward-facing triangle test; placed assets use their normalized minimum Y plus the independently editable ground offset. This is an approximate contact system, not wheel-by-wheel physics. The editor warns about off-platform origins and intersecting model bounds.

See [inventory.json](inventory.json) for material values, bounds, node names, texture byte sizes, filenames and hashes. [Contact sheet](model-contact-sheet.jpg) shows every candidate GLB. [Reference sheet](reference-contact-sheet.jpg) is supporting evidence only; the rejected lifting-bar image is excluded.
