# Sources and licenses

Project GLBs are copies of the user's Trellis2-generated Downloads files. Generation provenance is user-provided; no additional commercial-product authenticity or licensing is inferred. Confirm rights to the final Parliament Hill artwork before distribution.

The bundled development target files are `card.png` and `card.mind` from the official [MindAR v1.2.5 example](https://github.com/hiukim/mind-ar-js/tree/v1.2.5/examples/image-tracking/assets/card-example), renamed only within this project's targets directory. MindAR is MIT licensed; the example is provided for development testing and is not campaign artwork. Check third-party artwork rights before using that sample outside development.

MindAR copyright (c) 2020 hiukim (as stated in the bundled upstream license). MIT permission: use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies, subject to preserving the copyright and permission notice. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. See `node_modules/mind-ar/LICENSE` for the complete installed notice.

Runtime/development packages: Three.js (MIT), MindAR (MIT), Vite (MIT), node-qrcode (MIT), glTF Transform (MIT), meshoptimizer (MIT), Sharp (Apache-2.0), Playwright (Apache-2.0). Their license files are in the installed packages. No external font service is required.

Primary educational/technical sources, consulted November 20, 2026:

- UN SDG 11 and target 11.1: https://sdgs.un.org/goals/goal11
- University of Windsor, Special Projects: 3D Printed Housing: https://www.uwindsor.ca/engineering/civil/142/3d-printed-housing
- CMHC, Framework for change: Productivity in housing construction (November 26, 2025): https://www.cmhc-schl.gc.ca/observer/2025/framework-for-change-productivity-in-housing-construction
- Mitacs, Paving the way to concrete 3D printing for sustainable housing in cold regions: https://www.mitacs.ca/our-projects/paving-the-way-to-concrete-3d-printing-for-sustainable-housing-in-cold-regions/
- MindAR official Three.js integration: https://hiukim.github.io/mind-ar-js-doc/more-examples/threejs-image/
- MindAR target compiler: https://hiukim.github.io/mind-ar-js-doc/tools/compile

The affordability discussion combines the project's social-innovation framing with CMHC's productivity/policy discussion; it is not a quantitative forecast for Ottawa. Winter constraints are practical considerations, and the linked Mitacs project documents ongoing cold-region research rather than a claim of unrestricted winter operation.

## Generated asset provenance and publication review

The owner confirms that the 11 construction reference images were generated with ChatGPT’s AI image tool, then converted to GLB with Trellis2 through Hugging Face and Colab. The owner reports no third-party photographs or supplied copyrighted artwork. The 22 optimized GLBs are linked to those source files by the manifest, inventory hashes and runtime checksums. Visual review of all 44 material maps and 13 standalone images found no conflicting source indication; appearance cannot independently prove AI origin.

[OpenAI’s Terms of Use](https://openai.com/policies/terms-of-use/) address user ownership of output to the extent permitted by law, user responsibility for lawful input/output, and possible similarity to other output. That is not a promise of exclusive copyright or a waiver of unrelated third-party rights.

Microsoft’s [TRELLIS.2 software](https://github.com/microsoft/TRELLIS.2) and [TRELLIS.2-4B checkpoint](https://huggingface.co/microsoft/TRELLIS.2-4B) state MIT licensing. The private generation notebook was inspected read-only and loads that official checkpoint. The exact earlier Hugging Face Space URL is unavailable; its historical setup is not claimed as verified. The current official Space identifies MIT licensing. The upstream MIT notice is preserved in `public/models/TRELLIS2-LICENSE.txt` as attribution, without asserting that the owner’s outputs or application have been assigned a new umbrella license.

The official MindAR sample is the known non-ChatGPT image among the 57 audited images. Its MIT notice is retained in `public/targets/MINDAR-LICENSE.txt`. Nonessential EXIF/XMP/user-comment metadata was removed while preserving pixels, colour interpretation and display orientation. The paired compiled target is unchanged.

No final Parliament Hill artwork is included. Any future poster requires its own rights review. No commercial vendor, UN or college endorsement is implied. See `reports/final-publication-audit.md` for the review disposition and limits. No reuse license for the owner’s work is added merely by making the repository public.
