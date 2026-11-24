# Portfolio Design System

## Portfolio direction

The portfolio uses quiet, photography-first interface chrome around expressive project stories. The home page remains restrained; published case studies may use their own palette, media composition, and project-specific modules inside one shared narrative system.

Base tokens:

- Canvas: `#ffffff`
- Parchment: `#f5f5f7`
- Ink: `#1d1d1f`
- Muted ink: `#7a7a7a`
- Hairline: `#e0e0e0`
- Action blue: `#0066cc`
- Dark tile: `#272729`
- Case-study typography: `"Cabinet Grotesk", "Outfit", sans-serif`

## Required case-study sequence

Every published project follows the same semantic order and stable anchors:

1. Hero: project identity and concise proposition.
2. `showcase`: visual evidence and media controls.
3. `overview`: brief, role, team, constraints, and tools.
4. `research`: references, tests, findings, and resulting direction.
5. `experience`: “Gameplay” for games, with an adaptive visible label for other categories.
6. `process`: development, iteration, engineering, and production decisions.
7. `extras`: supporting material such as bosses, promotion, project management, or other project specific evidence.
8. `changelog`: releases or an iteration history.
9. `reflection`: outcomes, limitations, learning, and the next project action.

This is the portfolio’s AIDA spine: Hero creates Attention; Showcase through Research builds Interest; Experience through Changelog builds Desire; Reflection provides the Action.

## Publishing and content rules

- `caseStudyStatus: "published"` is reserved for projects with genuine evidence in every required chapter.
- Draft projects are excluded from the homepage, catalog, preloading, and previous/next navigation.
- Never fabricate research, testimonials, playtest results, responsibilities, metrics, or outcomes.
- Deep dives declare `extras` placement and sit within the shared Extras chapter.
- Every core chapter heading uses the same visible label as its navigation item.
- Changelogs use the shared accessible accordion and consistent version, title, date, and body fields.
- Artwork detail viewers are separate from the project case-study system.

## Editorial tone

- Use neutral, professional language based on observable work and documented evidence.
- State the context, decision, implementation, and result directly. Keep sentences concrete and concise.
- Avoid promotional adjectives, emotional framing, rhetorical transitions, vague claims, and generic phrases associated with generated portfolio copy.
- Use first person only when it identifies responsibility, a decision, a limitation, or a specific learning point.
- Reflections remain analytical: identify what worked, what did not, and what would change. Do not turn them into motivational conclusions.
- Avoid hyphens and em dashes as a writing rhythm. Use them only when required by a conventional term. Prefer short sentences, commas, or colons.

## Visual and interaction invariants

- Use the shared sticky chapter navigator with active-section feedback and stable anchors.
- Keep hero headings in a wide `max-w-6xl` region and to two or three lines.
- Major chapters use cinematic spacing around `py-32 md:py-44` or an intentionally equivalent rhythm.
- Bento layouts use `grid-flow-dense`; desktop spans must fill every row exactly.
- Use project-specific colors without compromising control contrast or focus visibility.
- Avoid numbered meta-labels, decorative stamps, tag spam, narrow heading columns, and unsupported claims.
- Do not use vertical scroll driven GSAP effects, text reveals, image scaling, parallax, or brightness changes inside case studies.
- Retain restrained interface motion for hover feedback, buttons, showcase controls, accordions, and opening or closing the case study.
- Select a chapter navigation item immediately when it is clicked, then keep the selection synchronized with manual scrolling.
- Smoothly scroll to a selected chapter while keeping its navigation pill selected throughout the movement. Respect reduced motion preferences.
- Use an opaque black background for the case study navigation in every project theme.
- Media must have useful alternative text; decorative imagery uses an empty alternative.
- Chapter links, accordions, carousels, close controls, and next-project actions must be keyboard operable.

## Current published studies

- Cubo: dark mine palette with warm orange accents; Extras covers bosses, progression, interface, and workflow.
- Everdew: dark green and acid-lime palette; deep dives cover gameplay video, project management, and promotion.
