# `.agents` MVP Design QA

## Comparison target

### Source visual truth

1. 一级项目页：`C:\Users\10979\.codex\generated_images\01a03a66-0858-73e0-a1c4-7959bdedd704\exec-f642b1c4-d1d1-4fc5-ac66-f38850447245.png`
   - Source pixels: 1487 × 1058.
   - State: desktop, page top, “项目”导航 active。
2. 二级项目页：`C:\Users\10979\.codex\generated_images\01a03a66-0858-73e0-a1c4-7959bdedd704\exec-8b2c1701-b05e-44e7-bf88-0b07632367ea.png`
   - Source pixels: 1487 × 1058.
   - State: desktop, page top, project module selected。

### Browser-rendered implementation

1. `docs/design/qa/implementation-home-1487x1058-final.png`
   - Implementation pixels: 1487 × 1058.
   - CSS viewport: 1487 × 1058; deviceScaleFactor: 1.
   - Route/state: `/`, page top, “项目”导航 active。
2. `docs/design/qa/implementation-project-1487x1058-final.png`
   - Implementation pixels: 1487 × 1057.
   - CSS viewport: 1502 × 1068; deviceScaleFactor: 1. The in-app browser capture excludes its 15 px vertical scrollbar and 11 px browser-owned edge area.
   - Density normalization: only the implementation height was scaled by 1 px for the full comparison, producing an equal 1487 × 1058 pair. No crop, content reflow or horizontal scaling was used.
   - Route/state: `/projects/agents/rules-contracts`, page top, “规则与合同” selected。

## Combined visual evidence

- Home full view: `docs/design/qa/compare-home-full-final.png` — source on the left, implementation on the right.
- Home focused region: `docs/design/qa/compare-home-focus-final.png` — header, title, project card, module preview and related ideas at equal crop coordinates.
- Project full view: `docs/design/qa/compare-project-full-final.png` — source on the left, implementation on the right.
- Project focused region: `docs/design/qa/compare-project-focus-final.png` — module navigation, active content, green callout, numbered list and related ideas at equal crop coordinates.

Focused comparisons were required because the full-view pairs reduce body copy and small navigation text. The focused pairs verify font weight, line height, card borders, callout color, link spacing, active navigation and icon alignment at readable size.

## Findings

No actionable P0, P1 or P2 findings remain.

The following visible differences are intentional product constraints rather than design drift:

- The source home mock includes repeated bottom promotion blocks for Skills and ideas. The implementation omits them because the approved MVP explicitly forbids repeating those blocks below the project entry.
- The source project mock shows an earlier five-part navigation. The implementation uses the six evidence-backed modules required by the product definition.
- The generic repository action is replaced by a locked “私有仓库” link and permission note because `.agents` is a private GitHub repository.
- Project and module copy is longer than the visual reference because every module must explain what it solves, what it does, why it is designed that way and where its boundary lies. The grid and type scale were adjusted so this additional content keeps the reference hierarchy.

## Required fidelity surfaces

### Fonts and typography

- Uses a high-contrast system sans stack that remains legible on Windows and mobile without a network font dependency.
- Display titles use 700–710 weight, restrained negative letter spacing and compact line height; body copy uses 1.7–1.9 line height.
- The first pass used oversized page and module headings. The final pass reduced the home title, project title and document heading scale to match the source hierarchy and prevent density drift.
- Long Skill names wrap with `overflow-wrap` and do not truncate. Chinese copy remains readable under the 390 px viewport and longer real text.

### Spacing and layout rhythm

- Desktop content is centered inside a 1360 px frame. The home project card is 760 px wide with a 1 px neutral border and 7 px radius, matching the source’s moderate entry size.
- The project page preserves the source’s breadcrumb → project title → divider → navigation/content/related-ideas structure.
- Desktop uses three columns; 768 px uses a horizontal module navigation and single content column; 390 px keeps a single readable column with intentional horizontal scrolling only inside the module navigator.
- Browser measurements reported zero page-level horizontal overflow at 1536, 1440, 768 and 390 widths.

### Colors and visual tokens

- The page is white with black and neutral-gray text, borders and surfaces. Green is limited to active navigation, links, small markers, numbered outlines and the light module callout.
- No gradients, decorative color fields, shadows or progress/KPI colors are present. The green treatment remains a small accent rather than a dominant surface.
- Text and focus states retain clear contrast; `focus-visible` uses a 2 px green outline with a 4 px offset.

### Image quality, assets and icons

- Neither visual truth contains real project imagery, so the implementation remains text-only and does not invent thumbnails, illustrations or preview images.
- All visible interface and social icons come from `@phosphor-icons/react`; there are no handcrafted inline SVGs, CSS drawings, emoji substitutes or placeholder images.
- The earlier custom favicon SVG was removed so the final build does not retain a hand-authored icon outside the library system.

### Copy and content

- Home contains exactly one real project. There are no future placeholders, project counts, dates, activity feeds, categories, progress indicators or invented screenshots.
- Every `.agents` module uses professional plain language and answers: what it solves, what it does, why the design exists, its boundary, source entries, verification and module relationships.
- Seven ideas have complete detail routes. Twenty-one in-scope Skills derived from the current supply manifest have independent detail routes and public-safe descriptions; the Codex Local Remote entry is excluded by the site boundary.
- No credentials, private personal evidence, machine paths or dynamic protection identifiers are rendered into the site.

### Interaction, responsiveness and accessibility

- Real internal navigation, module links, idea links, Skill links, browser back/forward and direct-route reload were exercised in the in-app browser.
- Mobile menu click, Enter and Space states were exercised. Internal project entry navigation was also exercised with Enter.
- External links have the expected targets; `mailto:` remains ordinary navigation. The private repository opens in a new tab and explains the possible permission 404.
- Responsive evidence:
  - `docs/design/qa/home-1440x900-final2.png`
  - `docs/design/qa/project-rules-768x1024-final.png`
  - `docs/design/qa/home-390x844-final.png`
  - `docs/design/qa/project-rules-390x844-final.png`
  - `docs/design/qa/project-context-390x844-final.png`
  - `docs/design/qa/mobile-menu-390x844-final.png`
  - `docs/design/qa/skills-390x844-final.png`
  - `docs/design/qa/idea-professional-390x844-final.png`
- All interactive mobile elements have at least a 44 px target on one axis; menu controls are 44 × 44. Reduced-motion rules are present.
- Console warning/error check returned an empty list after the final interaction run.

## Comparison history

### Pass 1 — blocked

- [P2] Typography and vertical hierarchy were too large and pushed the project document below the source rhythm.
  - Earlier evidence: `docs/design/qa/home-1536x1024-pass1.png` and `docs/design/qa/project-rules-1536x1024-viewport-pass1.png`.
  - Fix: removed the extra home/project eyebrow above the selected visual hierarchy, shortened the project-level summary, reduced page/card/project/document title scales and tightened the project header.
- [P2] The sixth module preview wrapped to a second line on desktop, unlike the single-row source treatment.
  - Fix: reduced the preview label track and separator margins, then adjusted preview link type by 0.5 px.

### Pass 2 — passed before independent review

- Post-fix evidence: all four final combined comparison files listed above.
- The project grid begins within 21 px of the source reference at the normalized desktop size; title/card positions and home card height now follow the same rhythm.
- All six module preview links share the same top coordinate in the final browser measurement.
- No P0/P1/P2 differences remain after accounting for the explicit product constraints.

### Independent review — blocked, then fixed

- [P1] Direct mobile routes for the last three project modules selected an off-screen item while the horizontal navigator remained at its initial position.
  - Fix: the module navigator now centers the active item on route entry and viewport changes, or scrolls to the maximum edge when centering is impossible.
  - Post-fix evidence: direct 390 px routes for “保护策略”“Skills / Plugins”“上下文与证据” all returned `fullyVisible: true`; the last item remained fully visible at the maximum scroll position. `docs/design/qa/project-context-390x844-final.png` records that state.
- [P2] The long “AI 承担专业判断，但服从目标和硬边界” mobile title left an orphaned character.
  - Fix: balanced heading wrapping plus a dedicated mobile idea-title size and letter-spacing rule.
  - Post-fix evidence: `docs/design/qa/idea-professional-390x844-final.png`; measured lines contain 10 and 9 characters, with no line shorter than three characters.
- [P2] Markdown backticks were visible in home and Skills prose.
  - Fix: public copy now contains plain `.agents` text; browser checks on `/` and `/skills` returned `markdownBacktickVisible: false`.
- [P1] Public Skills included an out-of-scope Codex Local Remote entry and named the machine-fact owner in the credential description.
  - Fix: removed that Skill and route; rewrote the credential entry as a normal managed credential-center description. Browser readback reports 21 entries and no visible `Codex Local Remote` or `PCConfig` text.
- [P1] Project overview, authorization and protection copy exposed implementation protocol instead of explaining the product.
  - Fix: visible body copy now explains permission, responsibility, candidate rules, activation and evidence in professional Chinese; exact protocol names remain only under “关键入口 / 如何验证”.
- [P2] The global footer repeated `.agents / Skills / 想法` navigation.
  - Fix: the footer now contains only the site signature; browser readback reports zero footer links.

### Final post-review pass — passed

- Re-ran visual, direct-route, keyboard, console, static-output and content checks after all six review fixes.
- No actionable P0/P1/P2 findings remain.

## Browser and build acceptance

- Vite production build generated 38 direct GitHub Pages route documents plus `sitemap.xml`.
- Automated content/route contract tests: 6 passed, 0 failed.
- Static-file server readback: 38/38 routes returned HTTP 200; an unknown path returned HTTP 404.
- Static direct route `/projects/agents/rules-contracts` returned the correct route title, canonical URL and rendered module heading.
- Custom `404.html` displayed the expected title, heading and real recovery links.
- Primary interactions tested: project entry, all module-navigation structure, the last three modules by direct mobile route, idea directory/detail, Skill directory/detail, mobile menu, keyboard activation, history back/forward, direct reload and 404 recovery.
- Browser console errors/warnings: none.

## Implementation checklist

- [x] Fix P2 typography and vertical hierarchy drift.
- [x] Keep all six module previews on one desktop row.
- [x] Verify 1440, 768 and 390 px responsive states without page-level horizontal overflow.
- [x] Verify real navigation, keyboard paths, direct routes, 404 and console.
- [x] Generate equal-state full and focused visual comparisons.
- [x] Re-run build, route generation and automated tests.

final result: passed
