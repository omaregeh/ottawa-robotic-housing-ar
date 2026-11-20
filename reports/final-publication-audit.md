# Final public-publication audit

The owner has authorized public publication of `omaregeh/ottawa-robotic-housing-ar`, GitHub Pages activation, and deployment after the privacy/security and provenance review. The owner confirms that reference images were generated with ChatGPT and then converted with Trellis2 using Hugging Face and Colab, with no third-party photographs or supplied copyrighted artwork known to have been used.

## History and upload scope

The repository initially had one reachable commit, one branch (`main`), and no tags or remote. Its 90 project files were enumerated from Git trees, not just the working directory. All source/configuration/docs, commit headers, GLB JSON, standalone images and 44 embedded GLB WebP textures were examined. The decoded MindAR target contains numeric feature data; its 112 string-valued entries are numeric strings. No external GLB image/buffer URI was present. No raw Downloads models, local working directories, private backups, documents from unrelated projects, credential stores, dependency directories or build output are part of the upload set.

The initial commit uses the owner's permitted public GitHub username and public noreply address. Public dependency-maintainer contact text in npm registry metadata and third-party attribution names/URLs are upstream provenance, not private owner contact information. No private owner email, phone, home address, private-network address, named home directory or unrelated document was detected. Pattern scans and visual review are practical checks, not proof against every possible hidden-data or secret format.

## Metadata cleanup

The official development target PNG had EXIF/XMP/user-comment metadata. Nonessential textual metadata and nested EXIF data were removed. Its image pixels and compressed image data, color profile, dimensions, and display orientation were preserved. The remaining orientation tag and color/DPI information are technical rendering data, not personal identifiers. The compiled target is unchanged; its paired PNG checksum was updated. Generated GLB textures have no EXIF/XMP data. Previously sanitized inspection thumbnails remain free of render text/EXIF metadata.

An exact private Git bundle and pre-cleanup target copy are retained under ignored `.local/`. The local initial commit is replaced before upload so its old metadata is not retained in the history reachable from the published branch. Private backup refs are not created or pushed. After replacement, the reachable history is re-audited before any publication.

## Asset rights and visual provenance review

The owner's source-image statement resolves the prior input-rights question. [OpenAI’s Terms of Use](https://openai.com/policies/terms-of-use/) assign OpenAI’s rights in output to the user to the extent permitted by law, while leaving responsibility for lawful content with the user and noting that output need not be unique. This is not a guarantee that generated images are independently copyrightable or free of every possible third-party claim.

The official [TRELLIS.2 software license](https://github.com/microsoft/TRELLIS.2/blob/main/LICENSE) and [Microsoft TRELLIS.2-4B model card](https://huggingface.co/microsoft/TRELLIS.2-4B) specify MIT licensing. A read-only inspection of the relevant private Colab notebook corroborated loading that official checkpoint from the Microsoft codebase. The current official Hugging Face demo also identifies its license as MIT. The exact earlier Space URL and historical configuration cannot be reconstructed; it is not represented as independently verified. No private notebook content, link or credential is included in Git.

All 57 standalone/embedded images were reviewed and classified:

| Group | Count | Source assessment |
|---|---:|---|
| GLB embedded base-colour maps | 22 | Two optimized qualities for each of 11 user-supplied models; consistent with the declared generated construction assets. |
| GLB embedded metallic/roughness maps | 22 | Companion material-data maps for those models; not photographs. |
| GLB render thumbnails | 11 | Local renders of the audited source GLBs, with identifying render metadata removed. |
| Model contact sheet | 1 | Composite of the 11 render thumbnails. |
| Development tracking image | 1 | **Known different origin:** official MindAR v1.2.5 example graphic, with the complete upstream MIT notice retained. Not claimed as ChatGPT artwork. |

Embedded texture atlases and their rendered objects show matching materials and silhouettes. No visible private photograph/document, unrelated project image, recognizable external artwork requiring a separate permission, or conflicting provenance was identified. Appearance and metadata cannot prove AI authorship; the ChatGPT input origin is owner-attested and visually consistent, not forensically certified. No vendor endorsement or product accuracy is claimed.

The official MindAR graphic is paired with its compiled target and its upstream MIT notice in `public/targets/MINDAR-LICENSE.txt`. A TRELLIS.2 upstream notice is included separately; this does not assign an umbrella license to the owner's application or generated assets. The final Parliament Hill artwork is not supplied or licensed by this review, and the rejected vacuum lifting-bar image/model is excluded.

**Review disposition:** no identified privacy/security finding or known licensing restriction prevents the authorized publication under the stated provenance. The unrecovered historical Hugging Face Space and limits of visual/authorship verification remain explicitly disclosed; the review does not make a universal legal-clearance claim.

## Testing status

All 11 original source hashes and all 11 preserved original-copy hashes still match. All 22 runtime GLBs validate against their checksums. The sanitized target retains identical pixels and display orientation. Previous real-runtime synthetic-camera tests passed detection, tracking loss/recovery and camera cleanup; no physical-phone test is claimed. See `testing.md` and the README for local/phone testing instructions. The owner separately authorizes Pages and deployment after this review; no certificate trust-store changes are made. Physical-phone tracking remains untested.

## Dependency security remediation

A complete npm audit was added to the final check. It identified advisories in the prior Vite patch and MindAR’s Node-only archive-installation chain, followed by an advisory in the asset-preparation Sharp version. Vite was updated to 6.4.6, Sharp to 0.35.5, and the `@mapbox/node-pre-gyp` dependency is scoped to patched `tar 7.5.23` through an npm override. MindAR’s browser runtime version and all GLB assets are unchanged; installation scripts remain disabled as documented. The patched helper’s module/extract API and Sharp WebP encoding/decoding were checked. A new full-graph `npm audit` reported zero advisories at review time; this is an advisory-database snapshot, not a guarantee that every dependency is vulnerability-free. The lockfile is committed for reproducibility. Unit tests, original/runtime asset validation, the Pages-mode build, browser regression checks and actual MindAR synthetic-camera tracking/loss/recovery tests passed after these changes. A clean staged-file export also installed successfully without raw originals and passed runtime validation and the Pages build. The initial history is replaced again so the superseded dependency graph is not uploaded.
