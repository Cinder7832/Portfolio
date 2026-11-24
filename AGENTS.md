Whatever action you can do yourself, please do yourself. This includes starting apps and performing verification.

## Case-study contract

- Treat `src/case-studies/definitions.ts` as the source of truth for every published project case study.
- A published study must contain, in this order: Hero, Showcase, Overview, Research, Experience, Process, Extras, Changelog, and Reflection.
- Use the stable chapter ids `showcase`, `overview`, `research`, `experience`, `process`, `extras`, `changelog`, and `reflection`. Do not rename, omit, or reorder them.
- The visible heading for every core chapter must exactly match its navigation label.
- Use “Gameplay” for game projects. For other categories, adapt only the visible Experience label, such as “Product Experience” or “Tool Experience”; keep the `experience` id.
- Place exceptional material such as bosses, promotion, or project management in the shared Extras chapter. Every typed deep dive uses `extras` placement.
- Keep incomplete projects at `caseStudyStatus: "draft"`. Do not publish a study or invent content to fill a required chapter.
- Preserve each project’s visual identity, but use `CaseStudyShell` for chapter navigation, spacing, interaction motion, and accessibility.
- Keep media and major content surfaces rounded across every project. Individual case studies may vary the corner radius, composition, colour, and typography while retaining this shared portfolio identity.
- Keep cards and media outlineless. Use background contrast, spacing, clipping, and shadow to define surfaces. Reserve borders for accessibility focus states and meaningful separators between sections, columns, or content groups.
- Every project details overlay must use the same large 16:9 landscape frame at every viewport width. Do not switch project details to a portrait or compact modal at smaller breakpoints.
- Do not add vertical scroll driven effects to case studies. Text opacity, image scale, image position, and brightness must remain stable while the reader scrolls.
- Retain normal interface motion such as hover feedback, button states, showcase movement, accordion transitions, and overlay opening or closing transitions.
- Chapter navigation must select the clicked item immediately. Manual scrolling must update the selected item from the case study scroll position.
- Chapter navigation scrolls smoothly to the selected section while keeping the selected pill stable. Use immediate scrolling when reduced motion is requested.
- The case study navigation surface is solid black with no transparency or backdrop blur.
- Every image in a Showcase must include an expand control that opens the shared fullscreen image viewer. Videos remain playable in place.
- Showcase chapters contain media only. Do not place visible descriptions or captions beneath the Showcase heading or its images.
- Every horizontal content rail must include previous and next arrow controls, with smooth scrolling unless reduced motion is requested.
- Case studies must not include a “Continue to next project” action.
- Keep case-study heroes wide and within two or three lines. Use dense, complete bento grids, high-contrast controls, descriptive media alternatives, and no numbered meta-labels.
- Do not place category, engine, or project type eyebrow text above case study titles. Every project uses the same bottom aligned hero title and summary treatment.
- Write in a neutral, professional, evidence-based tone. Prefer direct statements about the work, decision, and result. Avoid promotional adjectives, emotional framing, rhetorical claims, generic praise, and polished filler that reads as AI-generated.
- Use first person only to identify the author’s responsibility, decision, limitation, or learning. Do not anthropomorphise projects or describe them as inspiring, exciting, beautiful, powerful, or similar unless quoting a documented source.
- Avoid hyphens and em dashes in reader facing prose unless the term is conventionally written that way and removing the mark would be incorrect. Prefer a short sentence, comma, or colon.
- After changing a case study, run the production build and verify the overlay at mobile, tablet, and desktop widths.
