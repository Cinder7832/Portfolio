import { CASE_STUDY_CHAPTERS, type CaseStudyNavigationDefinition } from "./types";

const chaptersWithout = (...excluded: Array<(typeof CASE_STUDY_CHAPTERS)[number]>) =>
  CASE_STUDY_CHAPTERS.filter((chapter) => !excluded.includes(chapter));

const chaptersWithoutChangelog = chaptersWithout("changelog");
const chaptersWithoutExtras = chaptersWithout("extras");
const chaptersWithoutChangelogOrExtras = chaptersWithout("changelog", "extras");

const sharedLabels = {
  showcase: { label: "Showcase" },
  overview: { label: "Overview" },
  research: { label: "Research" },
  experience: { label: "Project Details" },
  process: { label: "Process" },
  extras: { label: "Extras" },
  changelog: { label: "Changelog" },
  reflection: { label: "Reflection" },
} as const;

export const caseStudyDefinitions = {
  cubo: {
    projectId: "cubo",
    title: "Cubo",
    theme: "cubo",
    hero: { label: "Cubo introduction" },
    chapters: chaptersWithoutExtras,
    sections: sharedLabels,
    deepDives: [
      { id: "cubo-bosses", label: "Bosses", placement: "experience" },
      { id: "cubo-progression", label: "Progression", placement: "experience" },
      { id: "cubo-interface", label: "Interface", placement: "experience" },
      { id: "cubo-workflow", label: "Workflow", placement: "process" },
    ],
  },
  everdew: {
    projectId: "everdew",
    title: "Everdew",
    theme: "everdew",
    hero: { label: "Everdew introduction" },
    sections: sharedLabels,
    deepDives: [
      { id: "everdew-management", label: "Project management", placement: "process" },
      { id: "everdew-promotion", label: "Promotion", placement: "extras" },
    ],
  },
  rebound: {
    projectId: "rebound",
    title: "Rebound",
    theme: "rebound",
    hero: { label: "Rebound introduction" },
    sections: sharedLabels,
    deepDives: [
      { id: "rebound-combat", label: "Combat modes", placement: "experience" },
      { id: "rebound-enemies", label: "Enemies and bosses", placement: "experience" },
      { id: "rebound-assets", label: "Blockbench assets", placement: "extras" },
    ],
  },
  ravensdown: {
    projectId: "ravensdown",
    title: "Ravensdown",
    theme: "ravensdown",
    hero: { label: "Ravensdown introduction" },
    sections: sharedLabels,
    deepDives: [
      { id: "ravensdown-assets", label: "Asset assembly", placement: "extras" },
      { id: "ravensdown-production", label: "Production organisation", placement: "process" },
      { id: "ravensdown-iteration", label: "Major visual iteration", placement: "process" },
    ],
  },
  "forgotten-line": {
    projectId: "forgotten-line",
    title: "The Forgotten Line",
    theme: "forgotten-line",
    hero: { label: "The Forgotten Line introduction" },
    sections: sharedLabels,
    deepDives: [
      { id: "forgotten-line-props", label: "Original prop work", placement: "process" },
      { id: "forgotten-line-interface", label: "Interface", placement: "experience" },
      { id: "forgotten-line-door", label: "Cut door interaction", placement: "extras" },
    ],
  },
  constructed: {
    projectId: "constructed",
    title: "Constructed",
    theme: "constructed",
    hero: { label: "Constructed introduction" },
    sections: sharedLabels,
    deepDives: [
      { id: "constructed-practice", label: "Professional practice", placement: "extras" },
      { id: "constructed-glasses", label: "Gurren Lagann glasses", placement: "process" },
      { id: "constructed-scripts", label: "Script evidence", placement: "process" },
    ],
  },
  "aztec-temple": {
    projectId: "aztec-temple",
    title: "Aztec Temple",
    theme: "aztec-temple",
    hero: { label: "Aztec Temple introduction" },
    sections: sharedLabels,
    chapters: chaptersWithoutChangelog,
    deepDives: [
      { id: "aztec-temple-renderer", label: "Renderer decision", placement: "process" },
      { id: "aztec-temple-assets", label: "Asset sources", placement: "extras" },
      { id: "aztec-temple-materials", label: "Material repair", placement: "process" },
    ],
  },
  miro: {
    projectId: "miro",
    title: "MIRO",
    theme: "miro",
    hero: { label: "MIRO introduction" },
    chapters: chaptersWithoutChangelog,
    sections: sharedLabels,
    deepDives: [
      { id: "miro-custom-assets", label: "Custom assets", placement: "process" },
      { id: "miro-production-workflow", label: "Production workflow", placement: "process" },
      { id: "miro-scope-control", label: "Scope control", placement: "extras" },
    ],
  },
  "independent-level-project": {
    projectId: "independent-level-project",
    title: "Independent Level Project",
    theme: "independent-level-project",
    hero: { label: "Independent Level Project introduction" },
    chapters: chaptersWithoutChangelog,
    sections: sharedLabels,
    deepDives: [
      { id: "independent-level-project-source", label: "Asset source", placement: "extras" },
      { id: "independent-level-project-scope", label: "Scope control", placement: "extras" },
      { id: "independent-level-project-workflow", label: "Build workflow", placement: "process" },
    ],
  },
  "eroded-sands": {
    projectId: "eroded-sands",
    title: "Eroded Sands",
    theme: "eroded-sands",
    hero: { label: "Eroded Sands introduction" },
    sections: sharedLabels,
    deepDives: [
      { id: "eroded-sands-assets", label: "Asset authorship", placement: "extras" },
      { id: "eroded-sands-vfx", label: "Dust VFX", placement: "process" },
    ],
  },
  horizon: {
    projectId: "horizon",
    title: "Horizon",
    theme: "horizon",
    hero: { label: "Horizon introduction" },
    chapters: chaptersWithoutChangelogOrExtras,
    sections: sharedLabels,
    deepDives: [
      { id: "horizon-landmark", label: "Ruined landmark", placement: "experience" },
      { id: "horizon-captures", label: "Render sequence", placement: "process" },
    ],
  },
} as const satisfies Record<string, CaseStudyNavigationDefinition>;

export type PublishedCaseStudyId = keyof typeof caseStudyDefinitions;

export const isPublishedCaseStudyId = (id: string): id is PublishedCaseStudyId => id in caseStudyDefinitions;
