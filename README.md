# Founder Fieldwork

[Open the course](https://rohitjz.github.io/founder-fieldwork/)

A focused course for solo founders and people building apps with AI. Learn one idea, check your understanding, and make one decision for your own project.

## Business Levers companion

[Open Business Levers](https://rohitjz.github.io/founder-fieldwork/business-levers/).

This separate guide follows [@thelazyceo's reel](https://www.instagram.com/reels/DerBPXstdkj/). The public caption supplies a broad business-levers theme and a claim that AI can speed up launching. It offers a further guide through a comment. The promised guide and evidence supporting the earnings headline were not available in the inspected public material.

The six original lessons cover reading an earnings claim, finding a buyer, relating visits to orders, contribution and costs, repeat purchases, and a bounded AI-assisted experiment. This is an independent companion, not the creator's hidden guide or a verified income method.

It uses the same focused Learn / Check / Apply reader, with its own curriculum, source notes, exports, and `business-levers-v1` storage record. It does not overwrite the existing founder course or its notes. Links between the two guides sit after the course outline.

The optional arithmetic explorer uses one fictional month in USD. It computes orders, net revenue, variable delivery cost, contribution, and a remainder after separately named acquisition and fixed costs. Break-even rounds up whole orders and uses integer cents for per-order contribution. Non-positive contribution produces an explicit limit rather than a false break-even quantity. Invalid or changed inputs hide stale results.

All example figures are invented assumptions, not benchmarks. Holding inputs constant explains arithmetic, not causality. The remainder is before tax and omitted costs, so it is not an earnings forecast. The companion has no OpenUI/React bundle, cabinet, API calls, account, or external assets; its generated HTML is under 100KB.

## The learning structure

The course follows a customer problem through a useful first offer and repeated use:

1. Find a real problem.
2. Test a useful offer.
3. Earn repeat use.

Each chapter contains three lessons. A lesson has one reading column and three separate steps:

- **Learn:** one core idea, a worked example, and a caution. Additional explanation is optional.
- **Check:** explain the idea from memory before revealing the question's answer choices.
- **Apply:** write a decision or next step for your own project.

Finishing requires the existing correct check and a non-empty application note. The completion screen shows the takeaway and your own decision, then offers the next lesson. Completion is a record of practice, not business validation or proof of comprehension.

The notebook keeps project decisions together. Editors are collapsed until needed. Notes and optional recall responses can be exported as Markdown; the entire course, including explanations and answer keys, can be printed.

## Why the structure changed

The earlier version put a marketing hero, interactive cabinet, section map, lesson sidebar, diagram, article, and note editor on the same path. The reader rejected that information architecture and its visuals.

The [audit and redesign plan](./REDESIGN-PLAN.md) records the observed gaps, measured baseline, alternatives, acceptance criteria, and implementation results. The new structure removes competing navigation and separates reading from checking and writing.

The established charcoal/yellow and light themes remain. Glass is restrained to the compact header. Reading content is flat, with a bounded measure and readable text. There is no permanent sidebar or parallel exercise panel.

## Purposeful visuals

OpenUI is retained only for interview-question comparison and MVP scope, where changing the view exposes a useful distinction. The two locally authored OpenUI Lang programs use a typed custom library and the actual `@openuidev/react-lang` renderer.

The published 0.4.1 parser takes `library.toJSONSchema(), library.root`. The build and tests use that installed API rather than examples for newer releases.

The Anatomy evidence cabinet is preserved in **optional evidence practice**, away from the main lesson path. Its 57 recorded solids, category model, depth ordering, keyboard-accessible quiz controls, and reduced-motion behavior remain. It is a physical analogy, not a startup score.

There are no automatic note templates, decorative tours, model calls, Gateway, cloud monitoring, API keys, or external runtime assets.

## Source boundary

Inspired by [@davecto's reel](https://www.instagram.com/reels/DeW-3XAxxpG/). Its public caption names Paul Graham, Y Combinator, and *The Mom Test*, but offers the complete nine-resource list through a comment-triggered message. That full list was not present in the inspected public material.

This course does **not** claim to reproduce the creator's list. It selects readings from the named sources and adds clearly labeled companion reading from Stripe, Rahul Vohra's Superhuman case study, and Sam Altman's playbook. The Reading list view shows each source and its provenance.

Lessons, examples, exercises, and checks are original teaching material. The receipt-chasing business is fictional. No video, book text, article passages, customer records, or credentials are redistributed.

## Run and maintain

The generated `index.html` is self-contained. It needs no installed dependencies, account, API key, or runtime download.

To build from source, use Node 20+, npm, and Python 3:

```sh
npm ci
npm run build
npm test
python3 -m http.server 8768 --bind 127.0.0.1
```

Open `http://127.0.0.1:8768/`. GitHub Pages serves the committed HTML from `main`. Regenerate it after editing sources.

- `src/lessons.mjs`: explanations, examples, exercises, checks, and original source links.
- `src/curriculum.mjs`: the original course's decision labels, chapters, and recall prompts.
- `src/learning.mjs`: shared routing and continue behavior; re-exports the original curriculum for compatibility.
- `src/course-config.mjs`: per-guide identity, source boundary, storage, and export settings.
- `src/levers.mjs`: the separate Business Levers lessons and curriculum.
- `src/economics.mjs`, `src/calculator.js`: bounded arithmetic model and its optional example explorer.
- `src/model.mjs`: progress validation, evidence classification, and export.
- `src/template.html`, `src/style.css`, `src/app.js`: the guided reader and supporting views.
- `src/visual-programs.mjs`, `src/openui-visuals.jsx`: the two focused interactive examples.
- `src/cabinet.mjs`: the optional evidence cabinet's recorded geometry.
- `build.mjs`: builds both self-contained guides and includes the renderer only where needed.

Useful direct links:

```text
#course
#lesson=problem
#lesson=problem&step=check
#lesson=problem&step=apply
#notebook
#sources
#lab
```

Old lesson links remain valid. Unknown lessons or steps display an explicit recovery page. Browser Back and Forward follow the selected lesson phase.

## Validation

`npm test` covers lesson completeness, evidence classification, storage validation, legacy-record compatibility, routing, resume behavior, recall export, geometry, and OpenUI schemas.

Browser checks are Playwright page functions. Run them with `playwright-cli run-code --filename=<file>` or an equivalent Playwright page runner against the loopback server:

- `tests/browser-check.js`: measurable IA criteria, all nine guided lessons, notebook, export, print, optional practice, sources, navigation, and responsive fit.
- `tests/storage-browser-check.js`: existing version-one records, unreadable-data preservation, recovery export, confirmed reset, and blocked-storage behavior.
- `tests/openui-browser-check.js`: only the two designated visuals, keyboard/touch controls, readable mobile labels, theme inheritance, and network-free interaction.
- `tests/levers-browser-check.js`: all six companion lessons, arithmetic and invalid-input handling, export/print, source boundaries, and storage isolation.

`npm run audit` runs the cabinet's true-shape geometry audit. Geometry has not been replaced by the information-architecture redesign.

Fewer controls and less scrolling are interface results. No user study has established a numerical improvement in comprehension or retention.

## Privacy and recovery

Notes use `founder-fieldwork-v1` in browser local storage. Existing notes, completion marks, and theme preference remain compatible. Optional recall notes extend the same record without a destructive version change. Nothing is uploaded to GitHub.

Business Levers uses the separate `business-levers-v1` key and its own export filename. Resetting one guide does not reset the other. Arithmetic examples reset on reload; they are not stored as financial records.

If storage is blocked, the page reports it and keeps the current session usable. Export before leaving. Unreadable data is preserved until you explicitly reset it; Notebook provides an export of the original record. Reset removes only this course's stored record after confirmation.

Do not put private customer details in the tool. Browser storage is not an encrypted notebook or a backup. Storage behavior for a downloaded HTML file varies by browser, so export before moving it.

## Credits

The vendored Anatomy geometry and audit kit is copyright 2026 Ryan under the MIT license in `vendor/LICENSE`. `THIRD_PARTY_NOTICES.txt` contains the licenses of packages bundled into the browser renderer. The build embeds those notices into the downloadable HTML as well.
